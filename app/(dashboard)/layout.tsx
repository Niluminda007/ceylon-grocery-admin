import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Header from "./_components/header";
import { Footer } from "./_components/footer";
import SideBar from "./_components/side-bar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="relative flex-1 flex w-full mt-20">
          <aside className="w-64 h-auto flex-shrink-0">
            <SideBar />
          </aside>
          <main className="flex-1 px-4 md:px-8 lg:px-16 py-4">{children}</main>
        </div>
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default HomeLayout;
