import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Book, Video, Heart, Star, BookOpen, Clock, Activity, Wind, Calendar, X, Search, ExternalLink, Timer, RotateCcw } from 'lucide-react';

const Resources = () => {
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const pomodoroIntervalRef = useRef(null);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Working YouTube videos for mental health
  const videos = [
    {
      id: '20eKKrMM3oY',
      title: 'Evening Relaxation Meditation — Let Go of Your Day',
      description: 'Wind down and release tension before bedtime.',
      duration: '12:20',
      category: 'meditation'
    },
    {
      id: 'ZME0JKiweL4',
      title: 'Daily Positive Affirmations',
      description: 'Boost confidence and positivity with daily affirmations.',
      duration: '6:48',
      category: 'motivation'
    },
    {
      id: 'cRVb1A7qHWA',
      title: 'Yoga Nidra for Deep Rest (20 min)',
      description: 'Guided practice for deep relaxation and better sleep.',
      duration: '20:00',
      category: 'yoga'
    },
    {
      id: 'FJJazKtH_9I',
      title: 'Progressive Muscle Relaxation',
      description: 'Guided technique to release tension throughout your body.',
      duration: '10:47',
      category: 'relaxation'
    },
    {
      id: 'WuyPuH9ojCE',
      title: 'Grounding Techniques',
      description: 'Simple exercises to stay present during overwhelming moments.',
      duration: '8:10',
      category: 'coping'
    },
    {
      id: 'sOvfOzdg9ig',
      title: 'Study With Me Pomodoro Session - 50/10',
      description: 'Focus and study together using the Pomodoro technique.',
      duration: '60:00',
      category: 'focus'
    }
  ];

  // Mental health blog posts
  const blogs = [
    {
      title: 'Understanding Anxiety: A Gentle Guide',
      excerpt: 'Anxiety is a natural human response, but when it becomes overwhelming, it can impact our daily lives. Learn about the different types of anxiety disorders, common symptoms, and evidence-based techniques for managing anxious thoughts and feelings.',
      readTime: '8 min read',
      category: 'Anxiety',
      content: `Anxiety is more than just feeling stressed or worried. It's a complex emotional and physical experience that affects millions of people worldwide. Understanding anxiety is the first step toward managing it effectively.

What is Anxiety?
Anxiety is your body's natural alarm system. When you perceive a threat, your body releases stress hormones like adrenaline and cortisol, preparing you for "fight or flight." This response can be helpful in truly dangerous situations, but sometimes our alarm system goes off when there's no real danger.

Common Symptoms:
• Physical: rapid heartbeat, sweating, trembling, shortness of breath
• Emotional: fear, worry, panic, irritability
• Cognitive: racing thoughts, difficulty concentrating, catastrophic thinking
• Behavioral: avoidance, restlessness, sleep disturbances

Healthy Coping Strategies:
1. Deep breathing exercises
2. Progressive muscle relaxation
3. Mindfulness meditation
4. Regular exercise
5. Maintaining a consistent sleep schedule
6. Limiting caffeine and alcohol
7. Connecting with supportive friends and family

Remember, seeking professional help is a sign of strength, not weakness. A mental health professional can provide personalized strategies and, if needed, discuss treatment options that might be right for you.`
    },
    {
      title: 'The Power of Mindfulness in Mental Health',
      excerpt: 'Mindfulness isn\'t just a buzzword – it\'s a scientifically-backed practice that can significantly improve mental health. Discover how present-moment awareness can reduce stress, anxiety, and depression while enhancing overall wellbeing.',
      readTime: '6 min read',
      category: 'Mindfulness',
      content: `Mindfulness is the practice of paying attention to the present moment without judgment. It's about observing your thoughts, feelings, and sensations as they arise, rather than getting caught up in them or trying to change them.

The Science Behind Mindfulness:
Research has shown that regular mindfulness practice can:
• Reduce symptoms of anxiety and depression
• Lower stress hormones like cortisol
• Improve emotional regulation
• Enhance focus and concentration
• Strengthen the immune system
• Improve sleep quality

Simple Mindfulness Practices:
1. Mindful Breathing: Focus on your breath for 5-10 minutes daily
2. Body Scan: Notice sensations throughout your body
3. Mindful Walking: Pay attention to each step and your surroundings
4. Mindful Eating: Savor each bite and notice flavors, textures, and smells
5. Loving-Kindness Meditation: Send good wishes to yourself and others

Starting Your Practice:
Begin with just 5 minutes a day. You can use guided meditations, apps, or simply sit quietly and focus on your breath. The key is consistency rather than duration. Even a few mindful breaths during a stressful moment can make a difference.

Remember, mindfulness is a skill that develops over time. Be patient with yourself as you learn, and don't judge your experience as "good" or "bad" – simply observe what arises with curiosity and compassion.`
    },
    {
      title: 'Building Resilience Through Self-Compassion',
      excerpt: 'Self-compassion is a powerful tool for mental health that involves treating yourself with the same kindness you would offer a good friend. Learn how to develop this skill and why it\'s crucial for emotional wellbeing.',
      readTime: '7 min read',
      category: 'Self-Care',
      content: `Self-compassion is often misunderstood as self-pity or self-indulgence, but research by Dr. Kristin Neff shows it's actually one of the most important skills for mental health and resilience.

The Three Components of Self-Compassion:

1. Self-Kindness vs. Self-Judgment
Instead of harsh self-criticism when you make mistakes or face difficulties, treat yourself with understanding and kindness. Speak to yourself as you would to a dear friend going through the same situation.

2. Common Humanity vs. Isolation
Recognize that suffering, failure, and imperfection are part of the human experience. You're not alone in your struggles – everyone faces challenges and makes mistakes.

3. Mindfulness vs. Over-identification
Observe your thoughts and feelings without getting swept away by them. Acknowledge your pain without exaggerating it or defining yourself by it.

Practical Self-Compassion Exercises:
• Self-Compassion Break: When facing difficulty, place your hand on your heart and acknowledge your suffering, remind yourself that you're not alone, and offer yourself kind words.
• Loving-Kindness for Self: Send yourself the same warm wishes you'd send to loved ones.
• Self-Compassion Letter: Write yourself a letter from the perspective of a compassionate friend.
• Mindful Self-Compassion: Notice when you're being self-critical and gently redirect with kindness.

The Benefits:
Research shows that self-compassionate people experience:
• Less anxiety and depression
• Greater emotional resilience
• Improved motivation and personal growth
• Better relationships
• Enhanced overall life satisfaction

Remember, self-compassion is not about lowering your standards or avoiding responsibility. It's about creating a supportive inner environment that allows you to learn from mistakes and grow while maintaining your emotional wellbeing.`
    },
    {
      title: 'Healthy Sleep Habits for Mental Wellness',
      excerpt: 'Quality sleep is fundamental to mental health, yet many people struggle with sleep issues. Explore the connection between sleep and mental wellbeing, plus practical tips for improving your sleep hygiene.',
      readTime: '9 min read',
      category: 'Sleep',
      content: `Sleep and mental health are deeply interconnected. Poor sleep can contribute to mental health problems, while mental health issues can disrupt sleep, creating a challenging cycle.

The Sleep-Mental Health Connection:
• Sleep helps process emotions and consolidate memories
• Lack of sleep can increase stress hormones
• Sleep deprivation affects mood regulation
• Many mental health conditions involve sleep disturbances
• Quality sleep supports cognitive function and emotional resilience

Common Sleep Challenges:
1. Difficulty falling asleep (sleep onset insomnia)
2. Frequent waking during the night
3. Early morning awakening
4. Non-restorative sleep
5. Irregular sleep schedule

Sleep Hygiene Tips:

Create a Sleep-Conducive Environment:
• Keep your bedroom cool, dark, and quiet
• Use comfortable mattress and pillows
• Remove electronic devices or use blue light filters
• Consider blackout curtains or eye masks

Establish a Bedtime Routine:
• Go to bed and wake up at the same time daily
• Create a relaxing pre-sleep ritual (reading, gentle stretching, meditation)
• Avoid caffeine, heavy meals, and alcohol before bedtime
• Stop using screens 1-2 hours before sleep

Daytime Habits for Better Sleep:
• Get natural sunlight exposure, especially in the morning
• Exercise regularly, but not close to bedtime
• Manage stress through relaxation techniques
• Limit daytime naps to 20-30 minutes

When to Seek Professional Help:
If sleep problems persist despite good sleep hygiene, or if they're significantly impacting your daily life, consider consulting a healthcare provider or sleep specialist. Sleep disorders are treatable, and addressing them can significantly improve both sleep and mental health.

Remember, improving sleep takes time and patience. Small, consistent changes to your sleep habits can lead to significant improvements in both your sleep quality and overall mental wellbeing.`
    }
  ];

  // Quick relief tools for mental health
  const quickTools = [
    {
      title: '5-4-3-2-1 Grounding',
      description: 'A quick technique to bring yourself back to the present moment',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can feel',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ],
      icon: <Activity className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Box Breathing',
      description: 'A simple breathing technique to calm your nervous system',
      steps: [
        'Inhale slowly for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly for 4 counts',
        'Hold at the bottom for 4 counts',
        'Repeat 4-5 times'
      ],
      icon: <Wind className="w-8 h-8" />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Daily Mood Tracker',
      description: 'Track your emotions to identify patterns and triggers',
      steps: [
        'Rate your mood on a scale of 1-10',
        'Note any significant events or thoughts',
        'Identify potential triggers or positive influences',
        'Look for patterns over time',
        'Share insights with your therapist if needed'
      ],
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Student-specific resources
  const studentResources = [
    {
      title: 'Exam Stress Management',
      description: 'Techniques to manage anxiety during exam periods',
      icon: '📚',
      tips: [
        'Create a realistic study schedule',
        'Take regular breaks using the Pomodoro technique',
        'Practice deep breathing before exams',
        'Get adequate sleep during exam periods'
      ]
    },
    {
      title: 'Study-Life Balance',
      description: 'Maintaining wellbeing while pursuing academic goals',
      icon: '⚖',
      tips: [
        'Schedule time for relaxation and social activities',
        'Set boundaries between study and personal time',
        'Prioritize self-care during busy periods',
        'Learn to say no to unnecessary commitments'
      ]
    },
    {
      title: 'Focus Enhancement',
      description: 'Improving concentration and productivity',
      icon: '🎯',
      tips: [
        'Minimize distractions during study sessions',
        'Use the Pomodoro technique for focused work',
        'Practice mindfulness to improve attention span',
        'Create a dedicated study space'
      ]
    }
  ];

  // Toggle favorite status
  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    // Save to localStorage for persistence
    localStorage.setItem('favoriteResources', JSON.stringify(Array.from(newFavorites)));
  };

  // Pomodoro timer functions
  const startPomodoro = () => {
    if (pomodoroIntervalRef.current) return;
    
    setIsPomodoroActive(true);
    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroTime((time) => {
        if (time <= 0) {
          clearInterval(pomodoroIntervalRef.current);
          pomodoroIntervalRef.current = null;
          setIsPomodoroActive(false);
          
          // Play notification sound
          new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play();
          
          // Switch mode
          if (pomodoroMode === 'work') {
            setPomodoroMode('break');
            setPomodoroTime(5 * 60);
            setCompletedSessions(prev => prev + 1);
          } else {
            setPomodoroMode('work');
            setPomodoroTime(25 * 60);
          }
          
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  };

  const pausePomodoro = () => {
    if (pomodoroIntervalRef.current) {
      clearInterval(pomodoroIntervalRef.current);
      pomodoroIntervalRef.current = null;
      setIsPomodoroActive(false);
    }
  };

  const resetPomodoro = () => {
    pausePomodoro();
    if (pomodoroMode === 'work') {
      setPomodoroTime(25 * 60);
    } else if (pomodoroMode === 'break') {
      setPomodoroTime(5 * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setPomodoroDuration = (minutes, mode) => {
    pausePomodoro();
    setPomodoroMode(mode);
    setPomodoroTime(minutes * 60);
  };

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteResources');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    };
  }, []);

  const addToSections = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header ref={headerRef} className="text-center py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
              Mental Health Resources
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your journey to mental wellness starts here. Explore curated videos, insightful blogs, and practical tools designed to support your mental health.
            </p>
            <div className="flex items-center justify-center space-x-2 text-indigo-600">
              <Heart className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-medium">Supporting your wellbeing</span>
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </header>

        {/* Videos Section */}
        <section
          ref={addToSections}
          className="max-w-7xl mx-auto px-4 mb-20 opacity-0 translate-y-8 transition-all duration-1000"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Video className="w-8 h-8 mr-3 text-indigo-600" />
              Guided Video Resources
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional-led videos covering meditation, relaxation, and practical techniques for mental wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <article
                key={video.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group relative"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                    title={video.title}
                    className="w-full h-full rounded-t-2xl"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div
                    aria-hidden="true"
                    className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm"
                  >
                    {video.duration}
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(video.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      favorites.has(video.id) 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.has(video.id) ? 'fill-current' : ''}`} 
                    />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{video.description}</p>
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {video.category}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pomodoro Timer Section for Students */}
        <section ref={addToSections} className="max-w-7xl mx-auto px-4 mb-20 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Timer className="w-8 h-8 mr-3 text-orange-600" />
              Study Focus Timer
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Use the Pomodoro technique to improve your focus and productivity. Study for 25 minutes, then take a 5-minute break.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-4 text-gray-800">
                {formatTime(pomodoroTime)}
              </div>
              <div className="text-lg font-medium text-gray-600 capitalize">
                {pomodoroMode === 'work' ? 'Focus Time' : 'Break Time'}
                {completedSessions > 0 && <span className="ml-2 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Sessions: {completedSessions}</span>}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={isPomodoroActive ? pausePomodoro : startPomodoro}
                className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${
                  isPomodoroActive 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isPomodoroActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
                  </>
                )}
              </button>
              
              <button
                onClick={resetPomodoro}
                className="px-6 py-3 rounded-full font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPomodoroDuration(25, 'work')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pomodoroMode === 'work' && pomodoroTime === 25 * 60
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                25 min Work
              </button>
              <button
                onClick={() => setPomodoroDuration(5, 'break')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pomodoroMode === 'break' && pomodoroTime === 5 * 60
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                5 min Break
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Pomodoro Technique Tips:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Choose a task to work on</li>
                <li>• Set timer to 25 minutes</li>
                <li>• Work until timer rings</li>
                <li>• Take a 5-minute break</li>
                <li>• After 4 sessions, take a longer break</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Student Resources Section */}
        <section ref={addToSections} className="max-w-7xl mx-auto px-4 mb-20 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 mr-3 text-green-600" />
              Student Wellness Resources
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Specialized resources to help students manage academic stress and maintain mental wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">{resource.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 group-hover:bg-white transition-colors duration-300">
                  <h4 className="font-medium text-gray-700 mb-2">Tips:</h4>
                  <ul className="space-y-1 text-gray-600">
                    {resource.tips.map((tip, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tools Section */}
        <section ref={addToSections} className="max-w-7xl mx-auto px-4 mb-20 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 mr-3 text-purple-600" />
              Quick Relief Tools
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple, evidence-based techniques you can use anytime to manage stress and anxiety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickTools.map((tool, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">{tool.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{tool.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 group-hover:bg-white transition-colors duration-300">
                  <h4 className="font-medium text-gray-700 mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    {tool.steps.map((step, i) => (
                      <li key={i} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blogs Section */}
        <section ref={addToSections} className="max-w-7xl mx-auto px-4 mb-20 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Book className="w-8 h-8 mr-3 text-green-600" />
              Insightful Mental Health Blogs
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Evidence-based articles and practical guidance written by mental health professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{blog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 group-hover:bg-green-700 w-fit">
                      <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>Read More</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(`blog-${index}`);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        favorites.has(`blog-${index}`) 
                          ? 'bg-red-100 text-red-600' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${favorites.has(`blog-${index}`) ? 'fill-current' : ''}`} 
                      />
                    </button>
                    </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Crisis Resources Section */}
        <section ref={addToSections} className="max-w-7xl mx-auto px-4 mb-20 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Immediate Help Available</h2>
              <p className="mb-6 max-w-2xl">If you're in crisis or experiencing thoughts of self-harm, please reach out to these resources immediately:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="font-semibold mb-2">National Suicide Prevention Lifeline</h3>
                  <p className="mb-2">Call or text 988 anytime</p>
                  <a href="tel:988" className="text-white font-bold underline">Call Now</a>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Crisis Text Line</h3>
                  <p className="mb-2">Text HOME to 741741</p>
                  <a href="sms:741741" className="text-white font-bold underline">Text Now</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Blog Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-100/90 via-indigo-100/90 to-purple-100/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-gray-200">
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedBlog.category}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedBlog.readTime}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{selectedBlog.title}</h1>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {selectedBlog.content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      {paragraph.split('\n').map((line, i) => {
                        if (line.startsWith('•')) {
                          return (
                            <div key={i} className="flex items-start ml-4 mb-1">
                              <span className="text-green-600 mr-2">•</span>
                              <span>{line.substring(1)}</span>
                            </div>
                          );
                        } else if (line.endsWith(':')) {
                          return <h3 key={i} className="text-xl font-semibold text-gray-800 mt-6 mb-3">{line}</h3>;
                        } else {
                          return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
                        }
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-12 px-4 bg-white bg-opacity-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600">Your mental health matters</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Remember: If you're experiencing a mental health crisis, please reach out to a mental health professional or crisis helpline immediately.
            </p>
            <p className="text-gray-400 text-xs">
              This resource is for informational purposes only and is not a substitute for professional medical advice.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .prose {
          max-width: none;
        }

        .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Resources;