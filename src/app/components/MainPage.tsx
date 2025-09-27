"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowRight,
} from "lucide-react";
import {
  tokens,
  Token,
  formatPrice,
  formatChange,
  formatMarketCap,
} from "../../lib/tokens";
import TokenDetailsScreen from "./TokenDetailsScreen";

const MainPage = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [purpleDivPosition, setPurpleDivPosition] = useState<'row2' | 'row3' | 'row4div2'>('row2');
  const [greenDiv1Position, setGreenDiv1Position] = useState<'row2div3' | 'row2div2' | 'row3div2'>('row2div3');
  const [purpleDiv2Position, setPurpleDiv2Position] = useState<'row4div2' | 'row4div3' | 'row3div3'>('row4div2');
  const [greenDiv2Position, setGreenDiv2Position] = useState<'row4div3' | 'row3div3' | 'row2div3'>('row4div3');

  // Animation sequence with two steps
  useEffect(() => {
    // Step 1: First movement after 2 seconds
    const timer1 = setTimeout(() => {
      setPurpleDivPosition('row3');
      setGreenDiv1Position('row2div2');
      setPurpleDiv2Position('row4div3');
      setGreenDiv2Position('row3div3');
    }, 2000);

    // Step 2: Second movement after 4 seconds
    const timer2 = setTimeout(() => {
      setPurpleDivPosition('row4div2');
      setGreenDiv1Position('row3div2');
      setPurpleDiv2Position('row3div3'); // moves from row4div3 to row3div3
      setGreenDiv2Position('row2div3');
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
  };

  const handleBack = () => {
    setSelectedToken(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-20">
      <AnimatePresence mode="wait">
        {!selectedToken ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Hero Section with Tagline */}
            <div className="text-left mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-16"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-wide"
                >
                  Choose your token for analysis
                  <br />
                  <span className="text-slate-600 dark:text-slate-400 text-xl font-medium">
                    Discover market signals, track trends, and identify trading
                    opportunities
                  </span>
                </motion.h1>
              </motion.div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="border border-slate-200 dark:border-slate-700 rounded-3xl h-[700px] w-full overflow-hidden bg-slate-900">
                <div className="flex flex-col items-center justify-center gap-4 h-full w-full overflow-hidden">
                  {/* Row 1 */}
                  <div className="flex items-center justify-center gap-4 w-[120%]">
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                  </div>

                    {/* Row 2 */}
                    <div className="flex items-center justify-center gap-4 w-[120%]">
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Purple div - only show when position is 'row2' */}
                        {purpleDivPosition === 'row2' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row2div2' */}
                        {greenDiv1Position === 'row2div2' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Green div - only show when position is 'row2div3' */}
                        {greenDiv1Position === 'row2div3' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row2div3' (from greenDiv2Position) */}
                        {greenDiv2Position === 'row2div3' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                      </div>
                    </div>

                   {/* Row 3 */}
                   <div className="flex items-center justify-center gap-4 w-[120%]">
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                       
                        {/* Purple div - only show when position is 'row3' */}
                        {purpleDivPosition === 'row3' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row3div2' */}
                        {greenDiv1Position === 'row3div2' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                       
                       {/* Green div - only show when position is 'row3div3' */}
                       {greenDiv2Position === 'row3div3' && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 bg-green-500"></div>
                           <div className="absolute inset-0 opacity-20" style={{
                             backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                             backgroundSize: '20px 20px'
                           }}></div>
                         </motion.div>
                       )}
                       
                       {/* Purple div - only show when position is 'row3div3' (from purpleDiv2Position) */}
                       {purpleDiv2Position === 'row3div3' && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 bg-purple-500"></div>
                           <div className="absolute inset-0 opacity-20" style={{
                             backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                             backgroundSize: '20px 20px'
                           }}></div>
                         </motion.div>
                       )}
                       
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                  </div>

                   {/* Row 4 */}
                   <div className="flex items-center justify-center gap-4 w-[120%]">
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Purple div - only show when position is 'row4div2' */}
                        {purpleDiv2Position === 'row4div2' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row4div2' (from purpleDivPosition) */}
                        {purpleDivPosition === 'row4div2' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Purple div - only show when position is 'row4div3' */}
                        {purpleDiv2Position === 'row4div3' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row4div3' */}
                        {greenDiv2Position === 'row4div3' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                              backgroundSize: '20px 20px'
                            }}></div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                      </div>
                    </div>

                   {/* Row 5 */}
                   <div className="flex items-center justify-center gap-4 w-[120%]">
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                       <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Right side - Search and tokens */}
              <div className="space-y-8">
                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="relative mb-8"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </motion.div>

                {/* Token Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {filteredTokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTokenSelect(token)}
                      className="group cursor-pointer relative"
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
                        {/* Subtle Background on Hover */}
                        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Token Header */}
                        <div className="flex items-center justify-between mb-5 relative z-10">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-semibold text-white shadow-sm"
                              style={{ backgroundColor: token.color }}
                            >
                              {token.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {token.name}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {token.symbol}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </div>

                        {/* Price Info */}
                        <div className="space-y-4 relative z-10">
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                              {formatPrice(token.price)}
                            </span>
                            <div
                              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                                token.change24h >= 0
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                            >
                              {token.change24h >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              <span>{formatChange(token.change24h)}</span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex justify-between">
                              <span className="font-medium">Market Cap:</span>
                              <span className="font-semibold">
                                {formatMarketCap(token.marketCap)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {filteredTokens.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        No tokens found matching &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <TokenDetailsScreen token={selectedToken} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPage;
