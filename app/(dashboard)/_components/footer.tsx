import Logo from "@/components/logo";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container ">
        <div className="flex justify-center items-center md:items-start space-y-4">
          <div className="flex items-center space-x-3">
            <Logo height={40} width={40} />
            <span className="text-xl font-semibold">Ceylon Grocery Admin</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        © 2024 Ceylon Grocery. All rights reserved.
      </div>
    </footer>
  );
};
