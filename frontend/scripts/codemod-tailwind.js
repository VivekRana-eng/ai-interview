const fs = require('fs')
const path = require('path')

const root = process.cwd()

const replacements = [
  ['min-h-screen bg-[#f7f9fc] flex items-center justify-center', 'pageShellCentered'],
  ['min-h-screen bg-[#f7f9fc] flex flex-col', 'pageShell'],
  ['bg-white border border-[#e2e8f0] rounded-xl p-6', 'cardP6'],
  ['bg-white border border-[#e2e8f0] rounded-xl p-5', 'cardP5'],
  ['bg-white border border-[#e2e8f0] rounded-xl p-8 max-w-md w-full mx-4 text-center', 'cardP8Centered'],
  ['bg-white border border-[#e2e8f0] rounded-xl overflow-hidden sticky top-[84px]', 'cardOverflowSticky'],
  ['bg-white border border-[#e2e8f0] rounded-xl overflow-hidden', 'cardOverflow'],
  ['bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden', 'cardCompactOverflow'],
  ['bg-white border border-[#e2e8f0] rounded-[10px] p-3.5 flex items-center gap-2.5 flex-wrap', 'cardControls'],
  ['bg-white border border-[#e2e8f0] rounded-[10px] p-4 flex items-center gap-3', 'cardControls'],
  ['w-10 h-10 bg-[#0F2744] rounded-md flex items-center justify-center', 'brandMark'],
  ['w-[30px] h-[30px] bg-white/10 rounded-md flex items-center justify-center', 'brandMarkSm'],
  ['text-sm font-bold text-[#0F2744] tracking-[0.01em]', 'brandTitle'],
  ['text-[10px] text-[#718096] font-normal uppercase tracking-[0.03em]', 'brandSubtitle'],
  ['text-[13px] font-semibold text-[#0F2744]', 'textPrimary13'],
  ['w-3.5 h-3.5', 'iconSm'],
  ['w-4 h-4', 'iconMd'],
  ['w-4.5 h-4.5', 'iconLg'],
  ['flex flex-col gap-1.5', 'flexColGap1_5'],
  ['flex flex-col gap-1', 'flexColGap1'],
  ['flex items-center gap-2', 'flexItemsGap2'],
  ['flex items-center gap-2.5', 'flexItemsGap2_5'],
  ['flex items-center gap-3', 'flexItemsGap3'],
  ['h-px bg-[#e2e8f0]', 'divider'],
  ['text-[11px] text-[#718096]', 'textSecondary11'],
  ['text-xs text-[#718096]', 'textSecondary12'],
  ['px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all', 'inputBase'],
  ['px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-[#f7f9fc] outline-none focus:border-[#0F2744] focus:bg-white transition-colors', 'inputBaseSoft'],
  ['px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all font-mono', 'inputBaseMono'],
  ['px-2.5 py-2 border-[1.5px] border-[#e2e8f0] rounded-lg text-[13px] text-[#4a5568] bg-[#f7f9fc] outline-none focus:border-[#0F2744] focus:bg-white cursor-pointer appearance-none pr-7', 'selectSoft'],
  ['px-3 py-2 border-[1.5px] border-[#e2e8f0] rounded-lg text-[13px] text-[#0F2744] bg-[#f7f9fc] outline-none focus:border-[#0F2744] focus:bg-white cursor-pointer appearance-none pr-8 min-w-[280px]', 'selectMin280'],
  ['px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all cursor-pointer appearance-none pr-8', 'selectBase'],
  ['inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', 'badgeBase'],
  ['inline-flex items-center gap-[5px] text-[11px] font-semibold uppercase tracking-[0.04em] px-[9px] py-1 rounded-full', 'badgeChip'],
  ['w-1.5 h-1.5 rounded-full', 'badgeDot'],
  ['px-3.5 py-3 whitespace-nowrap', 'tableCell'],
  ['px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap', 'tableCellText'],
  ['px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap tabular-nums', 'tableCellTextNums'],
  ['px-3.5 py-3 text-[13px] font-bold text-[#0F2744] whitespace-nowrap tabular-nums', 'tableCellStrong'],
  ['bg-white border border-[#e2e8f0] rounded-xl p-6', 'cardP6'],
  ['bg-white border border-[#e2e8f0] rounded-xl p-5', 'cardP5'],
  ['bg-white border border-[#e2e8f0] rounded-xl p-8 max-w-md w-full mx-4 text-center', 'cardP8Centered'],
  ['bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden', 'cardCompactOverflow'],
  ['bg-white border border-[#e2e8f0] rounded-xl overflow-hidden', 'cardOverflow'],
  ['bg-white border border-[#e2e8f0] rounded-xl overflow-hidden sticky top-[84px]', 'cardOverflowSticky'],
]

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.next') continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, files)
    else if (/\.(tsx|ts)$/.test(ent.name)) files.push(p)
  }
  return files
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const files = walk(root)

for (const file of files) {
  let txt = fs.readFileSync(file, 'utf8')
  const original = txt
  let changed = false

  for (const [cls, constName] of replacements) {
    const regex = new RegExp(`className=(["'\`])${escapeRegExp(cls)}\\1`, 'g')
    const next = txt.replace(regex, `className={tw.${constName}}`)
    if (next !== txt) {
      changed = true
      txt = next
    }
  }

  if (changed && !txt.includes("import * as tw from '@/lib/tailwindClasses'")) {
    const lines = txt.split('\n')
    let insertAt = 0
    while (insertAt < lines.length && lines[insertAt].startsWith('import ')) insertAt++
    lines.splice(insertAt, 0, "import * as tw from '@/lib/tailwindClasses'")
    txt = lines.join('\n')
  }

  if (txt !== original) fs.writeFileSync(file, txt, 'utf8')
}
