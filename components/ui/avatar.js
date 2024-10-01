import React from 'react'
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar"
import { User } from "lucide-react"

const Avatar = ({ src, alt, fallback, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <ShadcnAvatar className={`${sizeClass} ${className}`}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        {fallback ? (
          <span className="text-xs font-medium uppercase">{fallback}</span>
        ) : (
          <User className="w-3/5 h-3/5" />
        )}
      </AvatarFallback>
    </ShadcnAvatar>
  )
}

export default Avatar