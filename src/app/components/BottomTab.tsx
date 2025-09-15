// ...existing code...
import Link from 'next/link';
import Image from "next/image";

const icons = {
  map: '/globe.svg',
  home: '/next.svg',
  mypage: '/window.svg',
};

export default function BottomTab() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[390px] w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2">
      <Link href="/map" className="flex flex-col items-center text-gray-600 hover:text-blue-500 w-full py-2">
  <Image src={icons.map} alt="Map" width={28} height={28} className="mb-1" />
        <span className="text-[13px] font-medium">Map</span>
      </Link>
      <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-500 w-full py-2">
  <Image src={icons.home} alt="Home" width={28} height={28} className="mb-1" />
        <span className="text-[13px] font-medium">Home</span>
      </Link>
      <Link href="/mypage" className="flex flex-col items-center text-gray-600 hover:text-blue-500 w-full py-2">
  <Image src={icons.mypage} alt="Mypage" width={28} height={28} className="mb-1" />
        <span className="text-[13px] font-medium">Mypage</span>
      </Link>
    </nav>
  );
}
