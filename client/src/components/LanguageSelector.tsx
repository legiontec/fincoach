import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/language-context";
import { Language } from "@/lib/translations";

const languageNames: Record<Language, string> = {
  es: "Español",
  en: "English",
};

const languageFlags: Record<Language, string> = {
  es: "ES",
  en: "US",
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover-elevate active-elevate-2 bg-white"
          data-testid="button-language-selector"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setLanguage('es')}
          className={`cursor-pointer ${language === 'es' ? 'bg-accent' : ''}`}
          data-testid="option-language-es"
        >
          <span className="mr-2">{languageFlags.es}</span>
          {languageNames.es}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
          data-testid="option-language-en"
        >
          <span className="mr-2">{languageFlags.en}</span>
          {languageNames.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
