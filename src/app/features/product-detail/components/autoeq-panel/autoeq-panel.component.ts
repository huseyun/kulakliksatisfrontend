import {
  Component,
  OnDestroy,
  signal,
  inject,
  NgZone,
  input,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { AutoEQService } from '../../../../core/services/autoeq.service';
import {
  AutoEQSearchEntry,
  EqualizeResponse,
} from '../../../../models/autoeq.model';

const FILTER_TYPE_MAP: Record<string, BiquadFilterType> = {
  PK: 'peaking',
  LSC: 'lowshelf',
  HSC: 'highshelf',
  LPQ: 'lowpass',
  HPQ: 'highpass',
  NOTCH: 'notch',
};

const SAMPLE_AUDIO_PATH = '/assets/audio/sample.mp3';

@Component({
  selector: 'app-autoeq-panel',
  standalone: true,
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './autoeq-panel.component.html',
  styleUrls: ['./autoeq-panel.component.css'],
})
export class AutoeqPanelComponent implements OnDestroy {
  readonly productId = input.required<number>();
  readonly autoeqId = input<string | null>(null);

  private readonly autoEQService = inject(AutoEQService);
  private readonly ngZone = inject(NgZone);

  readonly searchControl = new FormControl<string | AutoEQSearchEntry>('');
  readonly suggestions = signal<AutoEQSearchEntry[]>([]);
  readonly selectedHeadphone = signal<AutoEQSearchEntry | null>(null);

  readonly isSearchLoading = signal(false);
  readonly isEqualizing = signal(false);
  readonly isPlaying = signal(false);
  readonly eqBypassed = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly currentEq = signal<EqualizeResponse | null>(null);

  // Web Audio API nodes — managed outside Angular zone
  private audioCtx: AudioContext | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        if (typeof value === 'string') {
          this.selectedHeadphone.set(null);
          if (value.trim().length > 0) {
            this.fetchSuggestions(value.trim());
          } else {
            this.suggestions.set([]);
          }
        }
      });
  }

  displayFn(entry: AutoEQSearchEntry | string | null): string {
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    return entry.label;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const entry = event.option.value as AutoEQSearchEntry;
    this.selectedHeadphone.set(entry);
  }

  private fetchSuggestions(q: string): void {
    this.isSearchLoading.set(true);
    this.autoEQService.searchHeadphones(q, 10).subscribe({
      next: res => {
        this.suggestions.set(res.results);
        this.isSearchLoading.set(false);
      },
      error: () => {
        this.suggestions.set([]);
        this.isSearchLoading.set(false);
      },
    });
  }

  startSimulation(): void {
    const headphone = this.selectedHeadphone();
    if (!headphone) return;

    // AudioContext'i kullanıcı tıklamasında hemen aç — tarayıcı autoplay kısıtlaması için
    this.ngZone.runOutsideAngular(() => {
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (!this.audioEl) {
        this.audioEl = new Audio(SAMPLE_AUDIO_PATH);
        this.audioEl.loop = true;
      }
      this.audioCtx.resume();
    });

    this.isEqualizing.set(true);
    this.errorMessage.set(null);

    this.autoEQService
      .equalize({ userHeadphoneId: headphone.id, productId: this.productId() })
      .subscribe({
        next: eq => {
          this.currentEq.set(eq);
          this.isEqualizing.set(false);
          this.setupAndPlay(eq);
        },
        error: () => {
          this.isEqualizing.set(false);
          this.errorMessage.set('EQ profili alınamadı. Lütfen tekrar deneyin.');
        },
      });
  }

  private setupAndPlay(eq: EqualizeResponse): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      }

      this.buildChain(eq);

      this.audioEl!.play()
        .then(() => this.ngZone.run(() => this.isPlaying.set(true)))
        .catch((err: unknown) => {
          console.error('Audio play failed:', err);
          this.ngZone.run(() =>
            this.errorMessage.set(
              'Ses çalınamadı. Dosya yüklenemiyor olabilir veya tarayıcı izin vermedi.'
            )
          );
        });
    });
  }

  private buildChain(eq: EqualizeResponse): void {
    if (!this.audioCtx || !this.audioEl) return;

    // Create source node only once per audio element
    if (!this.sourceNode) {
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audioEl);
    }

    // Disconnect existing nodes
    try { this.sourceNode.disconnect(); } catch { /* already disconnected */ }
    try { this.gainNode?.disconnect(); } catch { /* already disconnected */ }
    this.filterNodes.forEach(f => { try { f.disconnect(); } catch { /* already disconnected */ } });
    this.filterNodes = [];

    // Gain node (preamp: dB → linear)
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = Math.pow(10, eq.preampDb / 20);

    // Biquad filter nodes
    for (const f of eq.filters) {
      const node = this.audioCtx.createBiquadFilter();
      node.type = FILTER_TYPE_MAP[f.type] ?? 'peaking';
      node.frequency.value = f.fc;
      node.Q.value = f.q;
      node.gain.value = f.gain;
      this.filterNodes.push(node);
    }

    // Connect chain: source → gain → f1 → f2 → ... → destination
    let prev: AudioNode = this.sourceNode;
    prev.connect(this.gainNode);
    prev = this.gainNode;
    for (const node of this.filterNodes) {
      prev.connect(node);
      prev = node;
    }
    prev.connect(this.audioCtx.destination);
  }

  togglePlayPause(): void {
    if (!this.audioEl || !this.audioCtx) return;
    this.ngZone.runOutsideAngular(() => {
      if (this.audioEl!.paused) {
        this.audioCtx!.resume().then(() => {
          this.audioEl!.play().then(() =>
            this.ngZone.run(() => this.isPlaying.set(true))
          );
        });
      } else {
        this.audioEl!.pause();
        this.ngZone.run(() => this.isPlaying.set(false));
      }
    });
  }

  toggleBypass(): void {
    if (!this.audioCtx || !this.sourceNode) return;
    const nowBypassed = !this.eqBypassed();
    this.eqBypassed.set(nowBypassed);

    this.ngZone.runOutsideAngular(() => {
      try { this.sourceNode!.disconnect(); } catch { /* ignore */ }
      try { this.gainNode?.disconnect(); } catch { /* ignore */ }
      this.filterNodes.forEach(f => { try { f.disconnect(); } catch { /* ignore */ } });

      if (nowBypassed) {
        this.sourceNode!.connect(this.audioCtx!.destination);
      } else {
        const eq = this.currentEq();
        if (eq) this.buildChain(eq);
      }
    });
  }

  resetSimulation(): void {
    this.ngZone.runOutsideAngular(() => {
      this.audioEl?.pause();
    });
    this.isPlaying.set(false);
    this.currentEq.set(null);
    this.eqBypassed.set(false);
    this.errorMessage.set(null);
    this.selectedHeadphone.set(null);
    this.searchControl.reset('');
    this.suggestions.set([]);
  }

  ngOnDestroy(): void {
    this.audioEl?.pause();
    this.audioCtx?.close();
  }
}
