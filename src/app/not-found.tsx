"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarClock, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-primary">404</h1>

        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <CalendarClock className="w-48 h-48 text-muted-foreground" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight">Página não encontrada</h2>
            <p className="mt-4 text-muted-foreground">
              Desculpe, não conseguimos encontrar a página que você está procurando.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Página Inicial
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}

