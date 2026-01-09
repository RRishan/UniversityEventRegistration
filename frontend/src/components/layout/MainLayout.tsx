import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import crowdBg from "@/assets/crowd-bg.jpg";

interface MainLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
  title?: string;
  subtitle?: string;
}

const MainLayout = ({ children, showBackground = true, title, subtitle }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 relative">
        {showBackground && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${crowdBg})` }}
            />
            <div className="absolute inset-0 bg-primary/85" />
          </>
        )}
        
        <div className="relative z-10">
          {title && (
            <div className="pt-8 pb-4 px-6">
              <div className="container mx-auto">
                <h1 className="text-4xl font-light text-primary-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-primary-foreground/80 mt-2">{subtitle}</p>
                )}
              </div>
            </div>
          )}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
