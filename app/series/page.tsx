"use client"

import { useState, useEffect } from 'react';
import { Series, loadBlogData } from '@/lib/data-service';
import Link from 'next/link';

export default function AllSeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSeries = async () => {
      setLoading(true);
      try {
        // Fetch all blog data to get the series list
        const allData = await loadBlogData(1, 1); // We only need the series list, so limit posts
        setSeries(allData.series);
      } catch (error) {
        console.error("Failed to fetch series data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSeries();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading all series...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#0E4772" }}>
            All Blog Series
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections of articles on specific topics.
          </p>
        </div>
        
        {series.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {series.map(s => (
              <Link href={`/series/${s._id}`} key={s._id}>
                <div className="bg-gray-50 hover:bg-white border border-gray-200 rounded-lg p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: "#0E4772" }}>
                    {s.title}
                  </h2>
                  <p className="text-gray-600">
                    {s.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No series have been created yet.</p>
        )}
      </div>
    </div>
  );
}