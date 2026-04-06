import React from 'react';
import { useStories } from '../hooks/useStories';
import { StoryCard } from '../components/StoryCard';

const HomePage = () => {
  const { stories, loading, error } = useStories();

  return (
    <main className="container mx-auto py-16 px-6">
      {/* Başlık Alanı */}
      <header className="mb-14 border-l-4 border-orange-500 pl-6">
        <h2 className="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          Keşfet
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Milyonlarca kelime arasından sıradaki maceranı seç.
        </p>
      </header>

      {/* Yüklenme Durumu */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-4 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Hikayeler yükleniyor...</p>
        </div>
      ) : error ? (
        /* Hata Durumu */
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center">
          <p className="font-bold">Eyvah! Bir sorun var.</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        /* Hikaye Grid Yapısı */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;