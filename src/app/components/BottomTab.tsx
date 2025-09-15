import Link from 'next/link';

const icons = {
  map: '/globe.svg',
  home: '/next.svg',
  mypage: '/window.svg',
};

export default function BottomTab() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[390px] w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2">
      <Link href="/map" className="flex flex-col items-center text-gray-600 hover:text-blue-500 w-full py-2">
        <img src={icons.map} alt="Map" className="w-7 h-7 mb-1" />
        <span className="text-[13px] font-medium">Map</span>
      </Link>
      <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-500 w-full py-2">
        <img src={icons.home} alt="Home" className="w-7 h-7 mb-1" />
        <span className="text-[13px] font-medium">Home</span>
      </Link>
      <Link href="/mypage" className="flex flex-col items-center text-gray-600 hover:text-blue-500 w-full py-2">
        <img src={icons.mypage} alt="Mypage" className="w-7 h-7 mb-1" />
        <span className="text-[13px] font-medium">Mypage</span>
      </Link>
    </nav>
  );
}
