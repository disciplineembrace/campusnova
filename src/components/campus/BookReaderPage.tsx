'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bookmark, Sun, Moon, Type, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, BookOpen, List, X, Coffee } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'

const SAMPLE_BOOK = {
  title: 'Concepts of Physics - Chapter 1: Atomic Structure',
  totalPages: 24,
  chapters: [
    { title: 'Chapter 1: Atomic Structure', startPage: 1, endPage: 8 },
    { title: 'Chapter 2: Chemical Bonding', startPage: 9, endPage: 14 },
    { title: 'Chapter 3: Thermodynamics', startPage: 15, endPage: 20 },
    { title: 'Chapter 4: Electrochemistry', startPage: 21, endPage: 24 },
  ],
  pages: [
    `Chapter 1: Atomic Structure

1.1 Introduction

The atom is the basic unit of matter. It consists of a dense central nucleus surrounded by a cloud of negatively charged electrons. The atomic nucleus contains a mix of positively charged protons and electrically neutral neutrons.

The concept of the atom was first proposed by ancient Indian and Greek philosophers. However, it was John Dalton who, in 1803, proposed the atomic theory based on scientific evidence.

Key Points:
• Atoms are the building blocks of all matter
• Atoms are extremely small — typical sizes are around 100 picometers
• Every atom is composed of a nucleus and one or more electrons

1.2 Dalton's Atomic Theory

Dalton's atomic theory states that:
1. All matter is made of atoms. Atoms are indivisible and indestructible.
2. All atoms of a given element are identical in mass and properties.
3. Compounds are formed by a combination of two or more different kinds of atoms.
4. A chemical reaction is a rearrangement of atoms.

Modern modifications to Dalton's theory:
• Atoms are divisible into sub-atomic particles
• Atoms of the same element can have different masses (isotopes)
• Atoms can be created or destroyed in nuclear reactions`,

    `1.3 Discovery of Sub-atomic Particles

Discovery of Electron — J.J. Thomson (1897)

Thomson discovered the electron through his cathode ray tube experiments. He observed that:
• Cathode rays travel in straight lines
• They are deflected by electric and magnetic fields
• They carry negative charge
• The e/m ratio (charge to mass) was constant regardless of the gas used

Charge-to-mass ratio of electron: e/m = 1.758820 × 10¹¹ C kg⁻¹

Discovery of Proton — Goldstein (1886)

Eugen Goldstein discovered anode rays (canal rays) which were positively charged particles. The proton was later identified as the fundamental positive particle.

Charge of proton: +1.602 × 10⁻¹⁹ C
Mass of proton: 1.672 × 10⁻²⁷ kg

Discovery of Neutron — Chadwick (1932)

James Chadwick bombarded beryllium with alpha particles and discovered the neutron:
• Mass of neutron: 1.675 × 10⁻²⁷ kg (slightly more than proton)
• Charge of neutron: 0 (electrically neutral)`,

    `1.4 Thomson's Model of Atom (Plum Pudding Model)

J.J. Thomson proposed the first model of atomic structure in 1898:

• The atom is a sphere of positive charge
• Electrons are embedded in this sphere like plums in a pudding
• The total positive charge equals the total negative charge, making the atom neutral

Limitations of Thomson's Model:
✗ Could not explain the results of Rutherford's α-scattering experiment
✗ Could not explain the stability of the atom
✗ Could not explain the origin of spectral lines

1.5 Rutherford's Nuclear Model (1911)

Rutherford conducted the famous gold foil experiment by bombarding thin gold foil with α-particles. Key observations:

1. Most α-particles passed straight through → Atom is mostly empty space
2. Some α-particles were deflected at small angles → Positive charge in the center
3. Very few α-particles bounced back → Nucleus is very dense

Rutherford's conclusions:
• All positive charge and most mass is concentrated in the nucleus
• Electrons revolve around the nucleus in circular paths
• The size of the nucleus is very small compared to the size of the atom

Distance of closest approach: r₀ = 1/(4πε₀) × 2Ze²/(½mv²)`,

    `1.6 Bohr's Model of Atom (1913)

Niels Bohr proposed his model based on quantum theory:

Postulates of Bohr's Model:

1. Electrons revolve in certain fixed circular orbits (stationary orbits) without radiating energy
2. Only those orbits are permitted where angular momentum = nh/2π (Quantization condition)
3. Energy is emitted or absorbed when electrons jump between orbits

Key Equations:
• Radius of nth orbit: rₙ = 0.529 × n²/Z Å
• Energy of electron in nth orbit: Eₙ = -13.6 × Z²/n² eV
• Velocity of electron: vₙ = 2.188 × 10⁶ × Z/n m/s

Limitations of Bohr's Model:
✗ Could not explain spectra of multi-electron atoms
✗ Could not explain Zeeman and Stark effects
✗ Could not explain the shape of molecules
✗ Violates Heisenberg's uncertainty principle`,

    `1.7 Quantum Mechanical Model

The quantum mechanical model is based on the Schrödinger wave equation:

Ĥψ = Eψ

Where:
• Ĥ = Hamiltonian operator
• ψ = Wave function
• E = Energy of the system

Heisenberg's Uncertainty Principle:

It is impossible to simultaneously determine the exact position and momentum of an electron.

Δx × Δp ≥ h/4π

Quantum Numbers — Complete set of 4 quantum numbers describes an electron:

1. Principal Quantum Number (n): Shell number (1, 2, 3...)
   • Determines size and energy of orbital
   • n = 1, 2, 3, 4 → K, L, M, N shells

2. Azimuthal Quantum Number (l): Sub-shell (0 to n-1)
   • Determines shape of orbital
   • l = 0 (s), 1 (p), 2 (d), 3 (f)

3. Magnetic Quantum Number (mₗ): Orientation (-l to +l)
   • Determines orientation of orbital in space

4. Spin Quantum Number (mₛ): Electron spin
   • Values: +½ (↑) or -½ (↓)`,

    `1.8 Electronic Configuration

Rules for filling electrons:

1. Aufbau Principle: Electrons fill orbitals in order of increasing energy
   Order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s

2. Pauli's Exclusion Principle: No two electrons can have the same set of 4 quantum numbers
   → Maximum 2 electrons per orbital (↑↓)

3. Hund's Rule of Maximum Multiplicity:
   → Electrons occupy degenerate orbitals singly first, then pair up
   → Example: N (7): 1s² 2s² 2p³ → 2p has ↑ ↑ ↑ (not ↑↓ ↑)

Stability of Half-filled and Fully-filled Orbitals:
• Half-filled (d⁵, f⁷) and fully-filled (d¹⁰, f¹⁴) configurations are extra stable
• Due to symmetrical distribution and exchange energy
• Example: Cr = [Ar] 3d⁵ 4s¹ (not 3d⁴ 4s²)
• Example: Cu = [Ar] 3d¹⁰ 4s¹ (not 3d⁹ 4s²)

Summary:
Atomic structure is fundamental to understanding chemistry. From Dalton's simple model to the quantum mechanical model, our understanding has evolved significantly. The quantum mechanical model provides the most accurate description of electron behavior in atoms.`,

    `Practice Problems — Chapter 1

Q1. Calculate the radius of the 3rd orbit of hydrogen atom.
Solution: rₙ = 0.529 × n²/Z Å
r₃ = 0.529 × 9/1 = 4.761 Å

Q2. Calculate the energy of an electron in the 2nd orbit of He⁺ ion.
Solution: Eₙ = -13.6 × Z²/n² eV
E₂ = -13.6 × 4/4 = -13.6 eV

Q3. Write the electronic configuration of Fe (Z=26).
Solution: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²
Or [Ar] 3d⁶ 4s²

Q4. How many electrons can be accommodated in the L shell?
Solution: L shell = n = 2
Maximum electrons = 2n² = 2(4) = 8

Q5. Which quantum number determines the shape of an orbital?
Solution: Azimuthal quantum number (l) determines the shape.
l = 0 → spherical (s)
l = 1 → dumbbell (p)
l = 2 → clover (d)`,

    `Important Formulas — Chapter 1

1. Radius of nth orbit: rₙ = 0.529 × n²/Z Å
2. Energy of nth orbit: Eₙ = -13.6 × Z²/n² eV
3. Velocity in nth orbit: vₙ = 2.188 × 10⁶ × Z/n m/s
4. Angular momentum: L = nh/2π
5. Heisenberg's uncertainty: Δx × Δp ≥ h/4π
6. de Broglie wavelength: λ = h/mv
7. Energy of photon: E = hf = hc/λ
8. Rydberg formula: 1/λ = R(1/n₁² - 1/n₂²)
   where R = 1.097 × 10⁷ m⁻¹

Key Constants:
• h (Planck's constant) = 6.626 × 10⁻³⁴ J·s
• c (Speed of light) = 3 × 10⁸ m/s
• e (Electron charge) = 1.602 × 10⁻¹⁹ C
• mₑ (Electron mass) = 9.109 × 10⁻³¹ kg
• Nₐ (Avogadro's number) = 6.022 × 10²³ mol⁻¹`,
  ] as string[],
}

type ReadingMode = 'light' | 'dark' | 'sepia'

export default function BookReaderPage() {
  const { setCurrentPage, selectedProductId, bookmarks, toggleBookmark, readingProgress, setReadingProgress } = useAppStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [fontSize, setFontSize] = useState(16)
  const [readingMode, setReadingMode] = useState<ReadingMode>('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [zoom, setZoom] = useState(100)

  const totalPages = SAMPLE_BOOK.totalPages
  const bookId = selectedProductId || 'sample-book'
  const isBookmarked = bookmarks.includes(bookId)

  useEffect(() => {
    const saved = readingProgress[bookId]
    if (saved && saved > 1) {
      setCurrentPage(saved)
    }
  }, [bookId, readingProgress])

  useEffect(() => {
    setReadingProgress(bookId, currentPage)
  }, [currentPage, bookId, setReadingProgress])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const modeClasses: Record<ReadingMode, string> = {
    light: 'bg-white text-gray-900',
    dark: 'reader-dark',
    sepia: 'reader-sepia',
  }

  const contentPageIndex = Math.min(Math.floor((currentPage - 1) / 3), SAMPLE_BOOK.pages.length - 1)
  const pageContent = SAMPLE_BOOK.pages[contentPageIndex] || ''

  return (
    <div className={`min-h-screen ${modeClasses[readingMode]} reader-page transition-colors duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${controlsVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${readingMode === 'light' ? 'bg-white/90 border-b border-gray-200' : readingMode === 'dark' ? 'bg-[#1a1a2e]/90 border-b border-gray-700' : 'bg-[#f4ecd8]/90 border-b border-amber-200'} backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')} className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[400px]">{SAMPLE_BOOK.title}</h1>
              <p className="text-xs opacity-60">Page {currentPage} of {totalPages}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => toggleBookmark(bookId)} className="rounded-xl">
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl">
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const modes: ReadingMode[] = ['light', 'sepia', 'dark']
                const next = modes[(modes.indexOf(readingMode) + 1) % modes.length]
                setReadingMode(next)
              }}
              className="rounded-xl"
            >
              {readingMode === 'dark' ? <Sun className="w-5 h-5" /> : readingMode === 'sepia' ? <Coffee className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setFontSize(f => Math.min(f + 2, 24))} className="rounded-xl hidden sm:flex">
              <Type className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setFontSize(f => Math.max(f - 2, 12))} className="rounded-xl hidden sm:flex">
              <Type className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Table of Contents */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed left-0 top-0 bottom-0 w-72 z-50 ${readingMode === 'dark' ? 'bg-[#1a1a2e]' : readingMode === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-white'} shadow-2xl overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Contents</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-xl h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {SAMPLE_BOOK.chapters.map(ch => (
                    <button
                      key={ch.title}
                      onClick={() => { handlePageChange(ch.startPage); setSidebarOpen(false) }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        currentPage >= ch.startPage && currentPage <= ch.endPage
                          ? 'bg-brand/10 text-brand font-medium'
                          : 'opacity-70 hover:opacity-100 hover:bg-black/5'
                      }`}
                    >
                      {ch.title}
                      <span className="text-xs opacity-50 ml-1">({ch.startPage}-{ch.endPage})</span>
                    </button>
                  ))}
                </div>

                {/* Bookmarks */}
                {isBookmarked && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Bookmark className="w-4 h-4 fill-yellow-500 text-yellow-500" /> Bookmarks
                    </h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => { handlePageChange(readingProgress[bookId] || 1); setSidebarOpen(false) }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-black/5 flex items-center gap-2"
                      >
                        <BookOpen className="w-3 h-3" /> Continue reading (Page {readingProgress[bookId] || 1})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reader Content */}
      <div
        className="max-w-3xl mx-auto px-6 py-8 cursor-pointer select-none"
        onClick={() => setControlsVisible(v => !v)}
      >
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          className="whitespace-pre-wrap"
        >
          {pageContent}
        </motion.div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className={`sticky bottom-0 z-40 ${controlsVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${readingMode === 'light' ? 'bg-white/90 border-t border-gray-200' : readingMode === 'dark' ? 'bg-[#1a1a2e]/90 border-t border-gray-700' : 'bg-[#f4ecd8]/90 border-t border-amber-200'} backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Progress slider */}
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xs opacity-60 w-8 text-right">{currentPage}</span>
            <Slider
              value={[currentPage]}
              min={1}
              max={totalPages}
              step={1}
              onValueChange={(v) => handlePageChange(v[0])}
              className="flex-1"
            />
            <span className="text-xs opacity-60 w-8">{totalPages}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {Math.round((currentPage / totalPages) * 100)}% read
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(z => Math.min(z + 10, 150))}
                className="h-8 w-8 rounded-lg hidden sm:flex"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(z => Math.max(z - 10, 70))}
                className="h-8 w-8 rounded-lg hidden sm:flex"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(100)}
                className="h-8 w-8 rounded-lg hidden sm:flex"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
