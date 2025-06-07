
"use client";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
// import { PawPrint } from "lucide-react";
import { PawPrint, Coffee } from "lucide-react";
export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="relative bg-background border-b border-border p-4">
      {/* Кнопка "Купить кофе" в левом верхнем углу */}
      <div className="absolute left-2 top-4">
        <a 
          href="#"
          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-foreground bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 rounded-md transition-colors"
          title="На кофе"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span className="sm:hidden text-xs">
            "На кофе"
          </span>
        </a>
      </div>
      
      {/* ThemeToggle остается в правом верхнем углу */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      
      {/* Основной контент центрируется */}
      <div className="flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto">

        {/* Заголовок центрируется */}
        <div className="text-center">
          <h1 className="text-2xl font-bold inline-flex items-center gap-2 text-foreground">
            <PawPrint className="w-6 h-6 text-primary" />
            Породы собак
            {/* <PawPrint className="w-6 h-6 text-primary" /> */}
          </h1>
          <h3 className="text-xl font-bold text-muted-foreground mt-1">
          Узнай всё о своём любимце 🐾
          </h3>
        </div>
      </div>
    </header>
  );
}

// "use client";

// import { ThemeToggle } from "@/components/ui/theme-toggle";
// import { PawPrint } from "lucide-react";

// export default function Header() {
//   return (
//     <header className="relative bg-background border-b border-border p-4">
//       <div className="absolute right-4 top-4">
//         <ThemeToggle />
//       </div>
//       <div className="flex flex-col md:flex-row items-center justify-between gap-2">
//         <div className="text-center md:text-left">
//           <h1 className="text-2xl font-bold inline-flex items-center gap-2 text-foreground">
//             <PawPrint className="w-6 h-6 text-primary" />
//             {/* <PawPrint className="w-6 h-6 text-foreground" strokeWidth={2} /> */}
//             Породы собак
//           </h1>
//           <h3 className="text-xl font-bold text-muted-foreground mt-1">
//             Узнай всё о своём любимце 🐾
//           </h3>
//         </div>
//       </div>
//     </header>
//   );
// }
