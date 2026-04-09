import { Scale } from 'lucide-react'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Scale className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">AJ Manager</h1>
            <p className="text-sm text-blue-200">Portal do Credor</p>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-6">{children}</main>
      <footer className="border-t bg-white py-4 px-6 text-center text-sm text-gray-500">
        Consulta pública conforme Art. 22, I, &apos;k&apos; e &apos;l&apos; da Lei 11.101/2005
      </footer>
    </div>
  )
}
