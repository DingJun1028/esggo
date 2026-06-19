import React from 'react'

type Props = {
  note?: string
}

export default function MentorLogos({ note }: Props) {
  return (
    <div className="text-center">
      {note && <p className="text-sm text-neutral-600 mb-4">{note}</p>}
      <div className="flex items-center justify-center gap-6 mb-6">
        <img src="https://cdn.imgchest.com/files/fee76fdc5649.png" alt="Apple" className="h-[100px]" />
        <img src="https://cdn.imgchest.com/files/3426a7ba6340.jfif" alt="Siemens" className="h-[100px]" />
        <img src="https://cdn.imgchest.com/files/f25cb908549c.jfif" alt="IBM" className="h-[100px]" />
        <img src="https://cdn.imgchest.com/files/f0f1ef9a0041.png" alt="Disney" className="h-[100px]" />
        <img src="https://cdn.imgchest.com/files/c9ca862c051a.png" alt="Stanford" className="h-[100px]" />
      </div>
    </div>
  )
}
