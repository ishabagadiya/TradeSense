"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowRight,
  Plus,
  Coins,
  BarChart3,
  Activity,
  DollarSign,
} from "lucide-react";
import {
  tokens,
  Token,
  formatPrice,
  formatChange,
  formatMarketCap,
} from "@/lib/tokens";

interface MainPageProps {
  onTokenSelect: (token: string) => void;
  loading?: boolean;
}

const MainPage = ({ onTokenSelect, loading = false }: MainPageProps) => {
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customToken, setCustomToken] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [purpleDivPosition, setPurpleDivPosition] = useState<
    | "row2"
    | "row3"
    | "row4div2"
    | "row4div3"
    | "row2div3"
    | "row3div3"
    | "row2div2"
  >("row2");
  const [greenDiv1Position, setGreenDiv1Position] = useState<
    "row2div3" | "row2div2" | "row3div2" | "row4div2" | "row4div3" | "row3div3"
  >("row2div3");
  const [purpleDiv2Position, setPurpleDiv2Position] = useState<
    "row4div2" | "row4div3" | "row3div3" | "row2div3" | "row2div2" | "row3div2"
  >("row4div2");
  const [greenDiv2Position, setGreenDiv2Position] = useState<
    "row4div3" | "row3div3" | "row2div3" | "row2div2" | "row3div2" | "row4div2"
  >("row4div3");

  // Animation sequence with continuous loop
  useEffect(() => {
    const runAnimationCycle = () => {
      // Step 1: First movement after 2 seconds
      const timer1 = setTimeout(() => {
        setPurpleDivPosition("row3");
        setGreenDiv1Position("row2div2");
        setPurpleDiv2Position("row4div3");
        setGreenDiv2Position("row3div3");
      }, 2000);

      // Step 2: Second movement after 4 seconds
      const timer2 = setTimeout(() => {
        setPurpleDivPosition("row4div2");
        setGreenDiv1Position("row3div2");
        setPurpleDiv2Position("row3div3"); // moves from row4div3 to row3div3
        setGreenDiv2Position("row2div3");
      }, 4000);

      // Step 3: Third movement after 6 seconds
      const timer3 = setTimeout(() => {
        setPurpleDivPosition("row4div3"); // row4div2 to row4div3 (purpleDivPosition was at row4div2)
        setGreenDiv1Position("row4div2"); // row3div2 to row4div2 (greenDiv1Position was at row3div2)
        setGreenDiv2Position("row2div2"); // row2div3 to row2div2 (greenDiv2Position was at row2div3)
        setPurpleDiv2Position("row2div3"); // row3div3 to row2div3 (purpleDiv2Position was at row3div3)
      }, 6000);

      // Step 4: Fourth movement after 8 seconds
      const timer4 = setTimeout(() => {
        setGreenDiv2Position("row3div2"); // row2div2 to row3div2 (greenDiv2Position was at row2div2)
        setPurpleDiv2Position("row2div2"); // row2div3 to row2div2 (purpleDiv2Position was at row2div3)
        setGreenDiv1Position("row4div3"); // row4div2 to row4div3 (greenDiv1Position was at row4div2)
        setPurpleDivPosition("row3div3"); // row4div3 to row3div3 (purpleDivPosition was at row4div3)
      }, 8000);

      // Step 5: Fifth movement after 10 seconds
      const timer5 = setTimeout(() => {
        setGreenDiv2Position("row4div2"); // row3div2 to row4div2 (greenDiv2Position was at row3div2)
        setPurpleDiv2Position("row3div2"); // row2div2 to row3div2 (purpleDiv2Position was at row2div2)
        setGreenDiv1Position("row3div3"); // row4div3 to row3div3 (greenDiv1Position was at row4div3)
        setPurpleDivPosition("row2div3"); // row3div3 to row2div3 (purpleDivPosition was at row3div3)
      }, 10000);

      // Step 6: Sixth movement after 12 seconds
      const timer6 = setTimeout(() => {
        setGreenDiv2Position("row4div3"); // row4div2 to row4div3 (greenDiv2Position was at row4div2)
        setPurpleDiv2Position("row4div2"); // row3div2 to row4div2 (purpleDiv2Position was at row3div2)
        setPurpleDivPosition("row2div2"); // row2div3 to row2div2 (purpleDivPosition was at row2div3)
        setGreenDiv1Position("row2div3"); // row3div3 to row2div3 (greenDiv1Position was at row3div3)
      }, 12000);

      // Restart the cycle after 14 seconds (2 seconds after step 6 completes)
      const restartTimer = setTimeout(() => {
        runAnimationCycle();
      }, 14000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(restartTimer);
      };
    };

    // Start the first cycle
    const cleanup = runAnimationCycle();

    return cleanup;
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token.symbol);
    setCustomToken("");
    setShowCustomInput(false);
    onTokenSelect(token.symbol);
    
    // Scroll to the selected token section after a short delay
    setTimeout(() => {
      const selectedSection = document.querySelector('[data-section="selected-token"]');
      if (selectedSection) {
        const elementTop = selectedSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - 300; // 200px from top
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleCustomTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customToken.trim()) {
      setSelectedToken(customToken.toUpperCase());
      setCustomToken("");
      setShowCustomInput(false);
      onTokenSelect(customToken.trim());
    }
  };

  const handleCustomInputToggle = () => {
    setShowCustomInput(!showCustomInput);
    if (showCustomInput) {
      setCustomToken("");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
          <div className="w-full">
            {/* Hero Section with Tagline */}
            <div className="text-left mb-10">
              <div className="mb-10">
                <h1 className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-wide">
                  <span className="inline-block bg-gradient-to-br from-green-300  to-white bg-clip-text text-transparent">
                    Choose your token for analysis
                  </span>
                  <br />
                  <span className="text-slate-600 dark:text-slate-400 text-xl font-medium inline-block">
                    <span className="inline-block">
                      Discover market signals, track trends, and identify trading
                      opportunities
                    </span>
                  </span>
                </h1>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="border border-slate-200 dark:border-slate-700 rounded-3xl h-[700px] w-full overflow-hidden bg-slate-900">
                <div className="flex flex-col items-center justify-center gap-4 h-full w-full overflow-hidden">
                  {/* Row 1 */}
                  <div className="flex items-center justify-center gap-4 w-[120%]">
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                  </div>

                    {/* Row 2 */}
                    <div className="flex items-center justify-center gap-4 w-[120%]">
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                        
                        {/* Purple div - only show when position is 'row2' */}
                  {purpleDivPosition === "row2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row2div2' */}
                  {greenDiv1Position === "row2div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BarChart3 className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row2div2' (from greenDiv2Position) */}
                  {greenDiv2Position === "row2div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Activity className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row2div2' (from purpleDiv2Position) */}
                  {purpleDiv2Position === "row2div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row2div2' (from purpleDivPosition) */}
                  {purpleDivPosition === "row2div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                        
                        {/* Green div - only show when position is 'row2div3' */}
                  {greenDiv1Position === "row2div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BarChart3 className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row2div3' (from greenDiv2Position) */}
                  {greenDiv2Position === "row2div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Activity className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row2div3' (from purpleDiv2Position) */}
                  {purpleDiv2Position === "row2div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row2div3' (from purpleDivPosition) */}
                  {purpleDivPosition === "row2div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                      </div>
                    </div>

                   {/* Row 3 */}
                   <div className="flex items-center justify-center gap-4 w-[120%]">
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                       
                        {/* Purple div - only show when position is 'row3' */}
                  {purpleDivPosition === "row3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row3div2' */}
                  {greenDiv1Position === "row3div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BarChart3 className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row3div2' (from greenDiv2Position) */}
                  {greenDiv2Position === "row3div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Activity className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row3div2' (from purpleDiv2Position) */}
                  {purpleDiv2Position === "row3div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                       
                       {/* Green div - only show when position is 'row3div3' */}
                  {greenDiv2Position === "row3div3" && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                             backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                           <div className="absolute inset-0 flex items-center justify-center z-20">
                             <Activity className="w-8 h-8 text-white opacity-90" />
                           </div>
                         </motion.div>
                       )}
                       
                       {/* Purple div - only show when position is 'row3div3' (from purpleDiv2Position) */}
                  {purpleDiv2Position === "row3div3" && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                             backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                           <div className="absolute inset-0 flex items-center justify-center z-20">
                             <DollarSign className="w-8 h-8 text-white opacity-90" />
                           </div>
                         </motion.div>
                       )}
                       
                       {/* Purple div - only show when position is 'row3div3' (from purpleDivPosition) */}
                  {purpleDivPosition === "row3div3" && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                             backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                           <div className="absolute inset-0 flex items-center justify-center z-20">
                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                               <Coins className="w-8 h-8 text-white opacity-90" />
                             </div>
                           </div>
                         </motion.div>
                       )}
                       
                       {/* Green div - only show when position is 'row3div3' (from greenDiv1Position) */}
                  {greenDiv1Position === "row3div3" && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                             backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                           <div className="absolute inset-0 flex items-center justify-center z-20">
                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                               <BarChart3 className="w-8 h-8 text-white opacity-90" />
                             </div>
                           </div>
                         </motion.div>
                       )}
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                  </div>

                   {/* Row 4 */}
                   <div className="flex items-center justify-center gap-4 w-[120%]">
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                        
                        {/* Purple div - only show when position is 'row4div2' */}
                  {purpleDiv2Position === "row4div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row4div2' (from purpleDivPosition) */}
                  {purpleDivPosition === "row4div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row4div2' */}
                  {greenDiv1Position === "row4div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BarChart3 className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row4div2' (from greenDiv2Position) */}
                  {greenDiv2Position === "row4div2" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Activity className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                        
                        {/* Purple div - only show when position is 'row4div3' */}
                  {purpleDiv2Position === "row4div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Purple div - only show when position is 'row4div3' (from purpleDivPosition) */}
                  {purpleDivPosition === "row4div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-purple-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row4div3' */}
                  {greenDiv2Position === "row4div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Activity className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Green div - only show when position is 'row4div3' (from greenDiv1Position) */}
                  {greenDiv1Position === "row4div3" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bg-slate-700/60 rounded-3xl w-full aspect-square overflow-hidden z-10"
                          >
                            <div className="absolute inset-0 bg-green-500"></div>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 90% 90%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 1px, transparent 1px),
                                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BarChart3 className="w-8 h-8 text-white opacity-90" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                      </div>
                    </div>

                   {/* Row 5 */}
                   <div className="flex items-center justify-center gap-4 w-[120%]">
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                     <div className="bg-slate-800/50 rounded-3xl w-[40%] aspect-square relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                     </div>
                  </div>
                </div>
              </div>

          {/* Right side - Search and tokens */}
              <div className="h-[700px] flex flex-col">
                {/* Fixed Search and Custom Token Section */}
                <div className="flex-shrink-0 space-y-6 py-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  </div>

                  {/* Custom Token Input */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Custom Token
                  </h3>
                      <button
                        onClick={handleCustomInputToggle}
                        className="flex items-center space-x-2 text-green-500 hover:text-green-600 text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                    <span>{showCustomInput ? "Hide" : "Add Custom Token"}</span>
                      </button>
                    </div>

                    {showCustomInput && (
                  <form
                    onSubmit={handleCustomTokenSubmit}
                    className="flex gap-3"
                  >
                        <input
                          type="text"
                          value={customToken}
                          onChange={(e) => setCustomToken(e.target.value)}
                          placeholder="Enter token symbol (e.g., DOGE, MATIC)"
                          className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-transparent transition-all duration-200 shadow-sm"
                          disabled={loading}
                        />
                        <button
                          type="submit"
                          disabled={loading || !customToken.trim()}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl transition-colors duration-200 font-medium"
                        >
                      {loading ? "Loading..." : "Add Token"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

            {/* Scrollable Token Grid */}
                <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-1 gap-4 pb-4">
                        {filteredTokens.map((token, index) => (
                          <div
                            key={token.id}
                            onClick={() => handleTokenSelect(token)}
                            className="group cursor-pointer relative hover:-translate-y-1 transition-transform duration-300"
                          >
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
                              {/* Subtle Background on Hover */}
                              <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              {/* Token Header */}
                              <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                                    <img 
                                      src={token.icon} 
                                      alt={token.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to colored background with symbol if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.style.backgroundColor = token.color;
                                          parent.innerHTML = token.symbol.charAt(0);
                                          parent.className += ' text-white font-semibold text-lg';
                                        }
                                      }}
                                    />
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
                            </div>
                          </div>
                        ))}
                      </div>

                      {filteredTokens.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
                    <Search className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                              No tokens found matching &quot;{searchQuery}&quot;
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
          </div>
        </div>
      </div>

        {/* Selected Token Display */}
        {selectedToken && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg" data-section="selected-token">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-800 dark:text-blue-300 font-bold text-lg">
                  Selected:{" "}
                  <span className="text-purple-700 dark:text-purple-400">
                    {selectedToken}
                  </span>
                </p>
                {loading && (
                  <p className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Fetching price data from Pyth Network...
                  </p>
                  )}
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default MainPage;
