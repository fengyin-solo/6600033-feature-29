<template>
  <div class="min-h-screen bg-[#0b1220] text-slate-200">
    <header class="border-b border-slate-700/80 px-6 py-5 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95 backdrop-blur">
      <div class="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div class="flex items-center gap-2.5 mb-1.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-900 font-black text-sm shadow-glow-cyan">MC</div>
            <h1 class="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 bg-clip-text text-transparent">蒙特卡洛模拟与统计假设检验平台</h1>
          </div>
          <p class="text-sm text-slate-500 flex items-center gap-2">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse-soft"></span>
            随机采样模拟 · 6种MC场景 · 假设检验 · 置信区间可视化
          </p>
        </div>
        <div v-if="store.result" class="flex items-center gap-2">
          <span class="badge" :class="precisionLevel === 'high' ? 'badge--positive' : precisionLevel === 'medium' ? 'badge--warning' : 'badge--danger'">
            <span class="w-1.5 h-1.5 rounded-full" :class="precisionLevel === 'high' ? 'bg-positive-bright' : precisionLevel === 'medium' ? 'bg-warning-bright' : 'bg-danger-bright'"></span>
            {{ precisionLevel === 'high' ? '高精度' : precisionLevel === 'medium' ? '中精度' : '低精度' }}
          </span>
        </div>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row gap-5 p-5">
      <div class="lg:w-1/4 space-y-5">
        <div class="card-surface p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">模拟场景</h3>
          </div>
          <div class="space-y-2">
            <div v-for="s in SCENARIOS" :key="s.id" @click="store.setScenario(s)"
              :class="[
                'cursor-pointer p-3 rounded-xl border text-sm transition-all duration-300 group',
                store.currentScenario.id === s.id
                  ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-950/60 to-cyan-900/30 shadow-glow-cyan scale-[1.02]'
                  : 'border-slate-700/60 bg-slate-850/40 hover:border-slate-500/70 hover:bg-slate-800/60'
              ]">
              <div class="flex items-center justify-between mb-1">
                <div :class="['font-bold', store.currentScenario.id === s.id ? 'text-cyan-300' : 'text-slate-200 group-hover:text-slate-100']">{{ s.name }}</div>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide"
                  :class="{
                    'bg-slate-700/60 text-slate-400': s.category === '基础',
                    'bg-purple-900/40 text-purple-300 border border-purple-500/30': s.category === '物理',
                    'bg-amber-900/40 text-amber-300 border border-amber-500/30': s.category === '金融',
                    'bg-rose-900/40 text-rose-300 border border-rose-500/30': s.category === '概率'
                  }">{{ s.category }}</span>
              </div>
              <div :class="['text-xs mt-0.5 leading-snug', store.currentScenario.id === s.id ? 'text-cyan-200/70' : 'text-slate-500 group-hover:text-slate-400']">{{ s.description }}</div>
            </div>
          </div>
        </div>

        <div class="card-surface p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">参数控制</h3>
          </div>
          <div class="mb-5">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs text-slate-400 font-medium">迭代次数</label>
              <span class="font-mono font-bold text-brand-accent text-lg px-2.5 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/30">{{ store.iterations.toLocaleString() }}</span>
            </div>
            <input type="range" min="100" max="5000" step="100" v-model.number="store.iterations" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            <div class="flex justify-between text-[10px] text-slate-600 mt-1 font-mono"><span>100</span><span>5,000</span></div>
          </div>
          <button @click="store.runSimulation" :disabled="store.isRunning"
            class="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
            :class="store.isRunning
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-glow-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] active:scale-[0.98]'">
            <template v-if="store.isRunning">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              运行中...
            </template>
            <template v-else>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              开始模拟
            </template>
          </button>
        </div>

        <div v-if="store.result" class="card-surface p-5 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div class="flex items-center gap-2 mb-4 relative">
            <svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">模拟结果</h3>
          </div>

          <div class="space-y-3 relative">
            <div class="bg-gradient-to-br from-cyan-950/70 via-cyan-900/40 to-slate-900/60 border border-cyan-500/40 rounded-xl p-4 shadow-glow-cyan">
              <div class="data-label mb-1 flex items-center gap-1.5">
                <svg class="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z"/></svg>
                估算值 (Estimate)
              </div>
              <div class="data-value data-value--primary mt-0.5">
                {{ store.result.estimate.toFixed(6) }}
              </div>
            </div>

            <template v-if="store.result.trueValue !== undefined">
              <div class="data-block bg-slate-900/70 border border-slate-700/60 hover:border-slate-600/80">
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-positive-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span class="data-label">真实值</span>
                </div>
                <span class="data-value data-value--true">{{ store.result.trueValue.toFixed(6) }}</span>
              </div>
            </template>

            <template v-if="store.result.error !== undefined">
              <div class="rounded-xl p-3.5 border transition-all duration-300"
                :class="{
                  'bg-positive-bg/40 border-positive-border/60 shadow-glow-positive': errorSeverity === 'low',
                  'bg-warning-bg/50 border-warning-border/70': errorSeverity === 'medium',
                  'bg-danger-bg/50 border-danger-border shadow-glow-danger animate-pulse-soft': errorSeverity === 'high'
                }">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <svg v-if="errorSeverity === 'low'" class="w-4 h-4 text-positive-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg v-else-if="errorSeverity === 'medium'" class="w-4 h-4 text-warning-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <svg v-else class="w-4 h-4 text-danger-bright animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span class="text-xs font-semibold tracking-wide"
                      :class="errorSeverity === 'low' ? 'text-positive-bright' : errorSeverity === 'medium' ? 'text-warning-bright' : 'text-danger-bright'">
                      {{ errorSeverity === 'low' ? '误差小' : errorSeverity === 'medium' ? '误差中' : '误差偏大' }}
                    </span>
                  </div>
                  <span class="font-mono font-extrabold text-lg tracking-tight"
                    :class="errorSeverity === 'low' ? 'text-positive-bright' : errorSeverity === 'medium' ? 'text-warning-bright' : 'text-danger-bright drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]'">
                    {{ store.result.error.toFixed(6) }}
                  </span>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <div class="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="errorSeverity === 'low' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : errorSeverity === 'medium' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'"
                      :style="{ width: errorBarWidth + '%' }"></div>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400 font-bold">{{ relativeErrorPercent }}%</span>
                </div>
              </div>
            </template>

            <div class="data-block bg-slate-900/50 border border-slate-800/60">
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
                <span class="data-label">样本总数</span>
              </div>
              <span class="font-mono font-bold text-key-value text-lg">{{ store.result.iterations.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:w-3/4 space-y-5">
        <div class="card-surface p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">收敛过程</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-500">Convergence Trace</span>
          </div>
          <div ref="convergenceRef" class="w-full rounded-xl border border-slate-700/50 overflow-hidden" style="height:250px;background:linear-gradient(180deg,#0f172a 0%,#0b1220 100%);"></div>
        </div>

        <div class="card-surface p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">样本分布直方图</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-500">Histogram · max 1,000 samples</span>
          </div>
          <div ref="histogramRef" class="w-full rounded-xl border border-slate-700/50 overflow-hidden" style="height:230px;background:linear-gradient(180deg,#0f172a 0%,#0b1220 100%);"></div>
        </div>

        <div class="card-surface p-5">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">假设检验 · 独立样本 T 检验</h3>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 border border-purple-500/30">Welch's t-test · α = 0.05</span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                样本组 A
                <span class="text-slate-500 font-normal font-mono text-[10px]">n = {{ group1Array.length }}</span>
              </label>
              <textarea v-model="group1Input" rows="2" class="w-full bg-slate-950/80 border-2 border-slate-700/60 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/70 focus:bg-slate-900/80 transition-all resize-none placeholder:text-slate-600" placeholder="逗号分隔，如: 5.1, 4.8, 5.3"></textarea>
            </div>
            <div>
              <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <span class="w-2 h-2 rounded-full bg-pink-400"></span>
                样本组 B
                <span class="text-slate-500 font-normal font-mono text-[10px]">n = {{ group2Array.length }}</span>
              </label>
              <textarea v-model="group2Input" rows="2" class="w-full bg-slate-950/80 border-2 border-slate-700/60 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/70 focus:bg-slate-900/80 transition-all resize-none placeholder:text-slate-600" placeholder="逗号分隔，如: 4.6, 4.2, 4.9"></textarea>
            </div>
          </div>

          <button @click="runTest" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] active:scale-[0.98] flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            执行 T 检验
          </button>

          <div v-if="store.testResult" class="mt-5 pt-5 border-t border-slate-700/60">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">检验结论</span>
              <span class="badge" :class="store.testResult.significant ? 'badge--danger' : 'badge--positive'">
                <span class="w-1.5 h-1.5 rounded-full" :class="store.testResult.significant ? 'bg-danger-bright' : 'bg-positive-bright'"></span>
                {{ store.testResult.significant ? '差异显著 · 拒绝H₀' : '差异不显著 · 接受H₀' }}
              </span>
              <span v-if="store.testResult.significant" class="text-[10px] text-danger-bright font-bold animate-pulse-soft">⚠ 存在统计显著性</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="stat-card stat-card--primary">
                <div class="stat-card__label">统计量 t</div>
                <div class="stat-card__value text-brand-accent text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{{ store.testResult.statistic }}</div>
              </div>

              <div class="stat-card transition-all duration-500"
                :class="store.testResult.significant ? 'stat-card--danger' : 'stat-card--positive'">
                <div class="stat-card__label flex items-center justify-center gap-1">
                  p 值
                  <svg v-if="store.testResult.significant" class="w-3 h-3 text-danger-bright animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </div>
                <div class="stat-card__value text-2xl"
                  :class="store.testResult.significant ? 'text-danger-bright drop-shadow-[0_0_10px_rgba(248,113,113,0.6)] animate-pulse-soft' : 'text-positive-bright drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'">
                  {{ store.testResult.pValue }}
                </div>
                <div class="mt-1 text-[10px] font-mono" :class="store.testResult.significant ? 'text-danger-bright/80' : 'text-positive-bright/80'">
                  {{ store.testResult.significant ? 'p < α = 0.05' : 'p ≥ α = 0.05' }}
                </div>
              </div>

              <div class="stat-card stat-card--neutral">
                <div class="stat-card__label">自由度 df</div>
                <div class="stat-card__value text-slate-100 text-2xl">{{ store.testResult.df }}</div>
              </div>

              <div class="stat-card transition-all duration-500"
                :class="store.testResult.significant ? 'stat-card--danger' : 'stat-card--positive'">
                <div class="stat-card__label">显著性判定</div>
                <div class="font-extrabold text-sm mt-0.5 uppercase tracking-wide"
                  :class="store.testResult.significant ? 'text-danger-bright' : 'text-positive-bright'">
                  {{ store.testResult.significant ? '显著 ✕' : '不显著 ✓' }}
                </div>
                <div class="mt-1.5 h-1 rounded-full overflow-hidden" :class="store.testResult.significant ? 'bg-danger-bg' : 'bg-positive-bg'">
                  <div class="h-full rounded-full transition-all duration-700"
                    :class="store.testResult.significant ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'"
                    :style="{ width: store.testResult.significant ? '100%' : Math.max(15, 100 - (store.testResult.pValue / 0.05) * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import { useMCStore, SCENARIOS } from './store/mc'

const store = useMCStore()
const convergenceRef = ref<HTMLDivElement | null>(null)
const histogramRef = ref<HTMLDivElement | null>(null)
const group1Input = ref('5.1,4.8,5.3,4.9,5.2,5.0,4.7,5.1,5.4,4.8')
const group2Input = ref('4.6,4.2,4.9,4.3,4.5,4.7,4.4,4.8,4.1,4.6')
let convChart: echarts.ECharts | null = null
let histChart: echarts.ECharts | null = null

const group1Array = computed(() => group1Input.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)))
const group2Array = computed(() => group2Input.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)))

const relativeErrorPercent = computed(() => {
  if (!store.result || store.result.error === undefined || store.result.trueValue === undefined || store.result.trueValue === 0) return '0.00'
  return ((store.result.error / Math.abs(store.result.trueValue)) * 100).toFixed(3)
})

const errorSeverity = computed<'low' | 'medium' | 'high'>(() => {
  if (!store.result || store.result.error === undefined || store.result.trueValue === undefined || store.result.trueValue === 0) return 'low'
  const rel = store.result.error / Math.abs(store.result.trueValue)
  if (rel < 0.005) return 'low'
  if (rel < 0.02) return 'medium'
  return 'high'
})

const errorBarWidth = computed(() => {
  if (!store.result || store.result.error === undefined || store.result.trueValue === undefined || store.result.trueValue === 0) return 10
  const rel = Math.min(1, store.result.error / Math.abs(store.result.trueValue) / 0.05)
  return Math.max(5, rel * 100)
})

const precisionLevel = computed<'high' | 'medium' | 'low'>(() => {
  if (!store.result || store.result.error === undefined || store.result.trueValue === undefined || store.result.trueValue === 0) return 'high'
  const rel = store.result.error / Math.abs(store.result.trueValue)
  if (rel < 0.005) return 'high'
  if (rel < 0.02) return 'medium'
  return 'low'
})

function initCharts() {
  if (convergenceRef.value) convChart = echarts.init(convergenceRef.value, {
    backgroundColor: 'transparent',
    darkMode: true
  })
  if (histogramRef.value) histChart = echarts.init(histogramRef.value, {
    backgroundColor: 'transparent',
    darkMode: true
  })
}

function updateCharts() {
  if (convChart && store.convergenceData.length > 0) {
    const lastVal = store.convergenceData[store.convergenceData.length - 1]?.[1] ?? 0
    const markLineData = store.result?.trueValue !== undefined ? [{
      yAxis: store.result.trueValue,
      lineStyle: { color: '#34d399', type: 'dashed', width: 2, opacity: 0.85 },
      label: {
        formatter: `真实值: {c}`,
        color: '#34d399',
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: 'rgba(16,185,129,0.12)',
        borderColor: 'rgba(16,185,129,0.5)',
        borderWidth: 1,
        padding: [3, 7],
        borderRadius: 4
      }
    }] : []

    convChart.setOption({
      backgroundColor: 'transparent',
      grid: { top: 30, bottom: 40, left: 70, right: 30 },
      xAxis: {
        type: 'value',
        name: '迭代步',
        nameTextStyle: { color: '#64748b', fontSize: 10, padding: [8, 0, 0, 0] },
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        splitLine: { lineStyle: { color: 'rgba(51,65,85,0.4)', type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        splitLine: { lineStyle: { color: 'rgba(51,65,85,0.4)', type: 'dashed' } }
      },
      series: [{
        type: 'line',
        data: store.convergenceData,
        smooth: true,
        lineStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#22d3ee' },
              { offset: 1, color: '#06b6d4' }
            ]
          },
          width: 2.5,
          shadowBlur: 15,
          shadowColor: 'rgba(34,211,238,0.55)'
        },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(34,211,238,0.35)' },
              { offset: 1, color: 'rgba(34,211,238,0.02)' }
            ]
          }
        },
        symbol: 'none',
        markLine: { symbol: 'none', data: markLineData, animation: true, animationDuration: 1000 },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: { color: '#22d3ee', borderColor: '#0b1220', borderWidth: 2 },
          label: { show: false },
          data: [{
            coord: [store.convergenceData.length - 1, lastVal],
            value: lastVal.toFixed(4)
          }]
        }
      }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1e293b',
        borderColor: '#475569',
        borderWidth: 1,
        textStyle: { color: '#e2e8f0', fontFamily: 'monospace', fontSize: 12 },
        extraCssText: 'border-radius: 10px; padding: 8px 12px; backdrop-filter: blur(8px);',
        valueFormatter: (v: number) => v.toFixed(6)
      }
    })
  }
  if (histChart && store.histogramData.xAxis.length > 0) {
    histChart.setOption({
      backgroundColor: 'transparent',
      grid: { top: 20, bottom: 45, left: 60, right: 20 },
      xAxis: {
        type: 'category',
        data: store.histogramData.xAxis,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 9, rotate: 30, fontFamily: 'monospace' },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        name: '频次',
        nameTextStyle: { color: '#64748b', fontSize: 10, padding: [0, 0, 8, 0] },
        axisLine: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        splitLine: { lineStyle: { color: 'rgba(51,65,85,0.4)', type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: store.histogramData.data,
        barWidth: '82%',
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#a78bfa' },
              { offset: 0.6, color: '#8b5cf6' },
              { offset: 1, color: '#6d28d9' }
            ]
          },
          borderRadius: [4, 4, 0, 0],
          shadowBlur: 12,
          shadowColor: 'rgba(139,92,246,0.45)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(139,92,246,0.7)',
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#c4b5fd' },
                { offset: 1, color: '#8b5cf6' }
              ]
            }
          }
        }
      }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1e293b',
        borderColor: '#475569',
        borderWidth: 1,
        textStyle: { color: '#e2e8f0', fontFamily: 'monospace', fontSize: 12 },
        extraCssText: 'border-radius: 10px; padding: 8px 12px;',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(139,92,246,0.12)' } }
      }
    })
  }
}

function runTest() {
  if (group1Array.value.length > 1 && group2Array.value.length > 1) {
    store.runTest(group1Array.value, group2Array.value)
  }
}

onMounted(() => {
  initCharts()
  store.runSimulation()
  window.addEventListener('resize', () => {
    convChart?.resize()
    histChart?.resize()
  })
})
watch(() => store.result, () => updateCharts(), { deep: true })
</script>
