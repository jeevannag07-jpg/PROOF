"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Menu, X } from "lucide-react";

export default function EditorialHeader() {
  const pathname = usePathname();
  const { user, switchRolePersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav = [
    { label: "MISSIONS", href: "/missions" },
    { label: "TALENT", href: "/talent" },
    { label: "REELS", href: "/reels" },
    { label: "DESIGN SYSTEM", href: "/design-system" },
  ];

  const rightNav = [
    { label: "DASHBOARD", href: "/dashboard" },
    { label: "PROFILE", href: `/profile/${user?.username || "jeevan"}` },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/missions") {
      return pathname.startsWith("/missions") || pathname.startsWith("/challenges");
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F7F5] border-b border-[#D9DAD6]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 md:px-12 h-16 flex items-center justify-between">
        {/* Left: Brand + Primary Links */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link
            href="/"
            className="text-lg font-bold tracking-widest text-[#111111] hover:text-black transition-colors"
          >
            PROOF
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {mainNav.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                    active
                      ? "text-[#111111] font-semibold underline decoration-2 underline-offset-8"
                      : "text-[#5F625F] hover:text-[#111111]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Dashboard + Profile + Persona Selector */}
        <div className="hidden md:flex items-center gap-8">
          {rightNav.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                  active
                    ? "text-[#111111] font-semibold underline decoration-2 underline-offset-8"
                    : "text-[#5F625F] hover:text-[#111111]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Subtle Persona Selector */}
          <div className="flex items-center border border-[#D9DAD6] px-2 py-1 font-mono text-[10px] text-[#5F625F] gap-1">
            <span className="uppercase text-[#5F625F] mr-1">ROLE:</span>
            <button
              type="button"
              onClick={() => switchRolePersona("jeevan")}
              className={`px-1.5 py-0.5 transition-colors uppercase ${
                user?.username === "jeevan"
                  ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                  : "hover:text-[#111111]"
              }`}
            >
              BUILD
            </button>
            <button
              type="button"
              onClick={() => switchRolePersona("alex_t")}
              className={`px-1.5 py-0.5 transition-colors uppercase ${
                user?.username === "alex_t"
                  ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                  : "hover:text-[#111111]"
              }`}
            >
              REV
            </button>
            <button
              type="button"
              onClick={() => switchRolePersona("rachel_a")}
              className={`px-1.5 py-0.5 transition-colors uppercase ${
                user?.username === "rachel_a"
                  ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                  : "hover:text-[#111111]"
              }`}
            >
              REC
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#111111] hover:text-[#5F625F]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D9DAD6] bg-[#F7F7F5] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {[...mainNav, ...rightNav].map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-mono text-xs uppercase tracking-widest py-1 ${
                    active
                      ? "text-[#111111] font-semibold"
                      : "text-[#5F625F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#D9DAD6] flex items-center justify-between text-[11px] font-mono text-[#5F625F]">
            <span>PERSPECTIVE</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  switchRolePersona("jeevan");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 uppercase ${
                  user?.username === "jeevan" ? "bg-[#111111] text-[#FFFFFF]" : ""
                }`}
              >
                Builder
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRolePersona("alex_t");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 uppercase ${
                  user?.username === "alex_t" ? "bg-[#111111] text-[#FFFFFF]" : ""
                }`}
              >
                Reviewer
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRolePersona("rachel_a");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 uppercase ${
                  user?.username === "rachel_a" ? "bg-[#111111] text-[#FFFFFF]" : ""
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
