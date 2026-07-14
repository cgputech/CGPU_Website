"use client";

import React, { useState } from "react";
import { Phone, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

const contacts: Contact[] = [
  {
    name: "Dr Sreejith BJ",
    role: "Placement Officer",
    phone: "+91 984333643",
    email: "cgpu@sctce.in",
  },
  {
    name: "Sreenandan",
    role: "Student Lead",
    phone: "+91 8907506106",
    email: "imsreenandan@gmail.com",
  },
];

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  const [copied, setCopied] = useState(false);
  const mobile = isMobile();

  const handlePhone = () => {
    if (mobile) {
      window.location.href = `tel:${contact.phone.replace(/\s/g, "")}`;
    } else {
      navigator.clipboard.writeText(contact.phone).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-custom bg-background p-4">
      <div>
        <p className="font-semibold text-text-primary text-sm">{contact.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">{contact.role}</p>
      </div>

      <div className="flex gap-2 w-full">
        {/* Phone / Copy button */}
        <Button
          size="sm"
          onClick={handlePhone}
          title={mobile ? `Call ${contact.name}` : "Copy number"}
          className="flex-1 justify-start text-white bg-primary-red hover:bg-primary-red-hover"
        >
          {copied ? (
            <Check className="size-3.5 shrink-0" />
          ) : mobile ? (
            <Phone className="size-3.5 shrink-0" />
          ) : (
            <Copy className="size-3.5 shrink-0" />
          )}
          <span className="truncate min-w-0">
            {copied ? "Copied!" : contact.phone}
          </span>
        </Button>

        {/* Email button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmail}
          title={contact.email}
          className="shrink-0 flex items-center gap-2"
        >
          <Mail className="size-3.5" />
          <span>Email</span>
        </Button>
      </div>
    </div>
  );
}

interface ContactDialogProps {
  children: React.ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-2 rounded-t-xl">
          <DialogTitle className="text-primary font-bold text-xl text-center">Contact us</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 p-4">
          {contacts.map((c) => (
            <ContactCard key={c.email} contact={c} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
