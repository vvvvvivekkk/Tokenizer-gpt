'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-400">
              GPT-Style Tokenizer Platform for students and researchers
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Resources</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600">API Docs</a></li>
              <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Legal</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-600">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} GPT-Style Tokenizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
