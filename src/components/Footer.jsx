export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} DebateArena. All rights reserved.
                </p>
                <p className="text-xs mt-1">
                    Built with Next.js & Tailwind CSS
                </p>
            </div>
        </footer>
    );
}
