import { useState, useEffect } from 'react';
import { useLeadModal } from '../context/ModalContext';
import { courseService } from '../services/db';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, User, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CoursesPage() {
  const { openModal } = useLeadModal();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for search and filter parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catList, courseList] = await Promise.all([
          courseService.getCategories(),
          courseService.getCourses()
        ]);
        setCategories(catList);
        setCourses(courseList);
        setFilteredCourses(courseList);
      } catch (err) {
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter logic runs whenever search or filters update
  useEffect(() => {
    let result = [...courses];

    // Search query check
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.categoryName.toLowerCase().includes(query) ||
        c.mentor.name.toLowerCase().includes(query)
      );
    }

    // Category filter check
    if (selectedCategory !== 'all') {
      result = result.filter(c => c.categoryId === selectedCategory);
    }

    // Difficulty level filter check
    if (selectedLevel !== 'all') {
      result = result.filter(c => {
        const level = c.level.toLowerCase();
        if (selectedLevel === 'beginner') return level.includes('beginner');
        if (selectedLevel === 'intermediate') return level.includes('intermediate');
        if (selectedLevel === 'advanced') return level.includes('advanced');
        return true;
      });
    }

    setFilteredCourses(result);
  }, [searchQuery, selectedCategory, selectedLevel, courses]);

  const difficultyLevels = [
    { label: 'All Levels', value: 'all' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];

  return (
    <div className="bg-white bg-soft-radial font-sans text-appleDark min-h-screen pt-24 pb-28 relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -left-20 w-[350px] h-[350px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-[1200px] px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-center py-12 max-w-[650px] mx-auto space-y-4 animate-fade-up">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-applePurple bg-applePurple/5 px-3.5 py-1.5 rounded-full border border-applePurple/10">Our Curriculum</span>
          <h1 className="text-4xl sm:text-5xl font-black text-appleDark tracking-tight leading-[1.1] pt-2">
            Industry-grade <span className="bg-apple-gradient bg-clip-text text-transparent">specializations</span>
          </h1>
          <p className="text-base font-semibold text-neutral-400 max-w-[500px] mx-auto">
            Curriculas engineered in partnerships with tech recruitment directors to fast-track your global tech career.
          </p>
        </div>

        {/* 1. SEARCH & LEVEL FILTER BAR */}
        <div className="mt-8 flex flex-col md:flex-row gap-5 items-center justify-between glass-panel p-4 rounded-[28px] shadow-soft animate-fade-up">
          {/* Search Input */}
          <div className="relative w-full md:max-w-[420px] flex items-center bg-appleGray rounded-full border border-black/[0.03] px-4 transition-all duration-300 focus-within:border-applePurple/20 focus-within:bg-white">
            <Search size={18} className="text-applePurple shrink-0 opacity-60" />
            <input
              type="text"
              placeholder="Search courses, mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-3.5 text-[14.5px] font-semibold text-appleDark placeholder-neutral-400 outline-none"
            />
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {difficultyLevels.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setSelectedLevel(lvl.value)}
                className={`rounded-full px-5 py-2.5 text-[13px] font-bold transition duration-300 ${
                  selectedLevel === lvl.value
                    ? 'bg-appleDark text-white shadow-soft'
                    : 'bg-transparent text-neutral-500 hover:text-applePurple hover:bg-appleGray'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>


        {/* 2. DYNAMIC 28 CATEGORY CHIPS SCROLLER */}
        <div className="mt-8 bg-white/50 border border-black/5 p-6 rounded-[28px] shadow-soft backdrop-blur-md animate-fade-up">
          <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-4">Filter by 28 Specialization Fields</p>
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 border ${
                selectedCategory === 'all'
                  ? 'bg-applePurple text-white border-transparent shadow-soft shadow-applePurple/10'
                  : 'bg-white text-neutral-600 border-black/5 hover:bg-appleGray hover:text-applePurple'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 border ${
                  selectedCategory === cat.id
                    ? 'bg-applePurple text-white border-transparent shadow-soft shadow-applePurple/10'
                    : 'bg-white text-neutral-600 border-black/5 hover:bg-appleGray hover:text-applePurple'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. DYNAMIC COURSE GRID */}
        {loading ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[430px] rounded-[32px] bg-white animate-pulse border border-black/5 flex flex-col p-6 space-y-4">
                <div className="h-48 w-full bg-neutral-100 rounded-2xl animate-pulse" />
                <div className="h-6 w-1/3 bg-neutral-100 rounded animate-pulse" />
                <div className="h-8 w-3/4 bg-neutral-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-neutral-100 rounded animate-pulse pt-4" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          /* Empty state */
          <div className="mt-16 text-center glass-panel rounded-[32px] p-16 shadow-soft space-y-5 max-w-[620px] mx-auto animate-fade-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-2xl font-black text-appleDark tracking-tight">No Programs Match Your Criteria</h3>
            <p className="text-base font-semibold text-neutral-400">
              Try resetting your search query, difficulty filters, or selecting a different specialization category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="rounded-full bg-appleDark hover:bg-applePurple px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition duration-300 shadow-soft"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Courses Grid */
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3 animate-fade-up">
            {filteredCourses.map(course => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-[32px] premium-card duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-neutral-50 border-b border-black/5">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-6 top-6 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold text-appleDark border border-white/50 shadow-soft">
                    {course.level}
                  </span>
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-applePurple bg-applePurple/5 px-2.5 py-1 rounded-full border border-applePurple/10 animate-fade-up">
                      {course.categoryName}
                    </span>
                    <Link to={`/courses/${course.slug}`}>
                      <h3 className="mt-4 text-2xl font-black text-appleDark group-hover:text-applePurple transition duration-300 line-clamp-1 tracking-tight">
                        {course.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-applePurple opacity-80" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={15} fill="currentColor" className="text-amber-400 border-transparent" /> 
                        <span className="text-appleDark font-bold">{course.rating}</span>
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-400 border-t border-black/[0.03] pt-3">
                      <User size={14} className="text-applePurple opacity-80" />
                      <span>Mentor: <strong className="text-neutral-600 font-bold">{course.mentor.name}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/[0.03] pt-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Investment</p>
                      <p className="text-2xl font-black text-appleDark">₹{course.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/courses/${course.slug}`}
                        className="rounded-xl border border-black/10 hover:border-applePurple px-3.5 py-2.5 text-xs font-bold text-neutral-600 hover:text-applePurple transition duration-300 bg-white"
                      >
                        Syllabus
                      </Link>
                      <button
                        type="button"
                        onClick={() => openModal(course.name)}
                        className="rounded-xl bg-applePurple hover:bg-appleGlow px-4 py-2.5 text-xs font-bold text-white transition duration-300 shadow-soft"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
