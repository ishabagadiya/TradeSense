"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Define interfaces for data structures
interface Influencer {
  id: number;
  name: string;
  coinImage: string;
  color: string;
}

interface InfluencerNode extends Influencer {
  radius: number;
  orbitRadius: number;
  angle: number;
  speed: number;
  x: number;
  y: number;
  fillGradient: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkle: number;
}

interface CentralNode {
  id: string;
  name: string;
  radius: number;
  x: number;
  y: number;
}

export default function InfluencerProfitUniverse() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG content
    d3.select<SVGSVGElement, unknown>(svgRef.current).selectAll("*").remove();

    // Influencer data with coin images and colors
    const influencerData: Influencer[] = [
      { id: 1, name: "Bitcoin", coinImage: "/img/btc.png", color: "#F7931A" },
      { id: 2, name: "Ethereum", coinImage: "/img/eth.png", color: "#627EEA" },
      { id: 3, name: "BNB", coinImage: "/img/bnb.png", color: "#F3BA2F" },
      { id: 4, name: "Solana", coinImage: "/img/sol.png", color: "#00FFA3" },
      { id: 5, name: "Cardano", coinImage: "/img/cardano.png", color: "#0033AD" },
      { id: 6, name: "Tron", coinImage: "/img/tron.png", color: "#FF0013" },
      { id: 7, name: "Avalanche", coinImage: "/img/avalanche.png", color: "#E84142" },
      { id: 8, name: "Bitget Token", coinImage: "/img/bitget_token.png", color: "#00FFFF" },
      { id: 9, name: "Polkadot", coinImage: "/img/polkadot.png", color: "#E6007A" },
      { id: 10, name: "Ton Coin", coinImage: "/img/ton-coin.png", color: "#0098EA" },
    ];

    // Set fixed node size since we removed profit data
    const nodeSize = 35;

    // Set dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select<SVGSVGElement, unknown>(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("transition", "none") // Disable CSS transitions for D3 animations
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("transition", "none"); // Disable CSS transitions for D3 animations

    // Create tooltip
    const tooltip = d3
      .select<HTMLDivElement, unknown>(tooltipRef.current!)
      .style("opacity", 0)
      .style("display", "none")
      .style("position", "absolute")
      .style("background", "rgba(2, 6, 23, 0.9)")
      .style("backdrop-filter", "blur(10px)")
      .style("border-width", "1px")
      .style("border-style", "solid")
      .style("border-color", "#3B82F6")
      .style("box-shadow", "0 0 20px rgba(0, 0, 0, 0.5)")
      .style("transition", "all 0.2s ease")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("font-size", "0.875rem")
      .style("padding", "0.75rem")
      .style("border-radius", "0.5rem")
      .style("max-width", "18rem");

    // Create a radial gradient for the background
    const defs = svg.append("defs");

    // Create updated radial gradient with new colors (#020617 as base)
    const radialGradient = defs
      .append("radialGradient")
      .attr("id", "universe-background")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    radialGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#041030"); // Slightly lighter shade

    radialGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#020617"); // The requested base color

    // Add background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#universe-background)");

    // Add stars in the background
    const starsCount = 200; // More stars for better effect
    const stars: Star[] = Array.from({ length: starsCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * 2000 + 1000, // Random twinkle timing
    }));

    const starsGroup = svg.append("g").attr("class", "stars");

    stars.forEach((star, i) => {
      const starElem = starsGroup
        .append("circle")
        .attr("cx", star.x)
        .attr("cy", star.y)
        .attr("r", star.radius)
        .attr("fill", "white")
        .attr("opacity", star.opacity);

      // Add twinkling effect
      function twinkle() {
        starElem
          .transition()
          .duration(star.twinkle)
          .attr("opacity", Math.random() * 0.5 + 0.2)
          .transition()
          .duration(star.twinkle)
          .attr("opacity", Math.random() * 0.8 + 0.2)
          .on("end", twinkle);
      }

      twinkle();
    });

    // Create central "sun" (Tradesense platform)
    const centralNode: CentralNode = {
      id: "central",
      name: "Tradesense",
      radius: 50, // Larger radius for better visibility
      x: width / 2,
      y: height / 2,
    };

    // Append center platform gradient
    // const centerGradient = defs.append("radialGradient").attr("id", "center-gradient");

    // centerGradient
    //   .append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "#3F83F8");

    // centerGradient
    //   .append("stop")
    //   .attr("offset", "60%")
    //   .attr("stop-color", "#1E40AF");

    // centerGradient
    //   .append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", "#1E3A8A");

    // Add center glow effect
    const centerGlow = svg
      .append("circle")
      .attr("cx", centralNode.x)
      .attr("cy", centralNode.y)
      .attr("r", centralNode.radius * 1.8)
      .attr("fill", "url(#center-gradient)")
      .attr("opacity", 0.3)
      .attr("filter", "blur(15px)");

    // Animate the glow
    function pulseGlow() {
      centerGlow
        .transition()
        .duration(3000)
        .attr("r", centralNode.radius * 2.2)
        .attr("opacity", 0.5)
        .transition()
        .duration(3000)
        .attr("r", centralNode.radius * 1.8)
        .attr("opacity", 0.3)
        .on("end", pulseGlow);
    }

    pulseGlow();

    // Add the Tradesense icon using image
    svg
      .append("image")
      .attr("href", "/img/tradesense_logo.svg")
      .attr("x", centralNode.x - centralNode.radius * 0.7)
      .attr("y", centralNode.y - centralNode.radius * 0.7)
      .attr("width", centralNode.radius * 1.4)
      .attr("height", centralNode.radius * 1.4)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("transition", "none"); // Ensure no CSS transitions interfere

    // Create orbits for influencers
    const orbitRadii = d3
      .scaleLinear()
      .domain([0, influencerData.length - 1])
      .range([140, 270]); // Slightly larger orbits

    // Draw orbits with improved styling
    influencerData.forEach((_, i) => {
      svg
        .append("circle")
        .attr("cx", centralNode.x)
        .attr("cy", centralNode.y)
        .attr("r", orbitRadii(i))
        .attr("fill", "none")
        .attr("stroke", "rgba(255, 255, 255, 0.07)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,5");
    });

    // Create influencer nodes
    const influencerNodes: InfluencerNode[] = influencerData.map((influencer, i) => {
      // Calculate initial angle
      const angle = i * (2 * Math.PI / influencerData.length);
      const orbitRadius = orbitRadii(i);

      return {
        ...influencer,
        radius: nodeSize,
        orbitRadius,
        angle,
        speed: 0.0002 * (6 - i), // Higher ranked influencers move faster
        x: centralNode.x + orbitRadius * Math.cos(angle),
        y: centralNode.y + orbitRadius * Math.sin(angle),
        fillGradient: "", // Will be set later
      };
    });

    // Create node gradients based on their coin colors
    influencerNodes.forEach((node) => {
      const gradientId = `gradient-${node.id}`;

      const nodeGradient = defs.append("radialGradient").attr("id", gradientId);

      // Customize gradient stops based on node's color
      nodeGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.rgb(node.color).brighter(1).toString());

      nodeGradient
        .append("stop")
        .attr("offset", "70%")
        .attr("stop-color", node.color);

      nodeGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.rgb(node.color).darker(1).toString());

    //   node.fillGradient = `url(#${gradientId})`;
      
      // Create filter for glow effect
      const filter = defs
        .append("filter")
        .attr("id", `glow-${node.id}`)
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
        
      filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "5")
        .attr("result", "blur");
        
      filter
        .append("feFlood")
        .attr("flood-color", node.color)
        .attr("result", "color");
        
      filter
        .append("feComposite")
        .attr("in", "color")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "shadow");
        
      filter
        .append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "shadow")
        .attr("operator", "over");
    });

    // Draw connection lines
    const connectionLinesGroup = svg.append("g").attr("class", "connection-lines");

    const connectionLines = connectionLinesGroup
      .selectAll<SVGLineElement, InfluencerNode>(".connection-line")
      .data(influencerNodes)
      .enter()
      .append("line")
      .attr("class", "connection-line")
      .attr("x1", centralNode.x)
      .attr("y1", centralNode.y)
      .attr("x2", (d) => d.x)
      .attr("y2", (d) => d.y)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", "5,5")
      .style("transition", "none"); // Disable CSS transitions for D3 animations

    // Draw trail effects for nodes
    const trailsGroup = svg.append("g").attr("class", "trails");

    // Create node elements
    const nodesGroup = svg.append("g").attr("class", "nodes");

    const nodeElements = nodesGroup
      .selectAll<SVGGElement, InfluencerNode>(".node")
      .data(influencerNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("mouseover", function(event: any, d: InfluencerNode) {
        // Highlight node with glow effect
        d3.select(this)
          .select(".node-circle")
          .transition()
          .duration(300)
          .attr("r", d.radius * 1.1)
          .attr("stroke-width", 4)
          .attr("filter", `url(#glow-${d.id})`);

        // Make connection line more prominent
        connectionLinesGroup
          .selectAll("line")
          .filter(function() {
            const lineX2 = parseFloat(d3.select(this).attr("x2"));
            const lineY2 = parseFloat(d3.select(this).attr("y2"));
            return Math.abs(lineX2 - d.x) < 0.1 && Math.abs(lineY2 - d.y) < 0.1;
          })
          .transition()
          .duration(300)
          .attr("stroke-width", 3)
          .attr("stroke-opacity", 0.9)
          .attr("stroke-dasharray", "none");

        // Show tooltip
        tooltip
          .style("opacity", 1)
          .style("display", "block")
          .style("border-color", d.color);

        tooltip.html(`
          <div style="font-weight: bold; font-size: 1.125rem; margin-bottom: 0.5rem; color: ${d.color};">${d.name}</div>
        `);
        
        // Position tooltip
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mousemove", function(event: any) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function(event: any, d: InfluencerNode) {
        // Restore node
        d3.select(this)
          .select(".node-circle")
          .transition()
          .duration(300)
          .attr("r", d.radius)
          .attr("stroke-width", 2)
          .attr("filter", "none");

        // Restore connection line
        connectionLinesGroup
          .selectAll("line")
          .filter(function() {
            const lineX2 = parseFloat(d3.select(this).attr("x2"));
            const lineY2 = parseFloat(d3.select(this).attr("y2"));
            return Math.abs(lineX2 - d.x) < 0.1 && Math.abs(lineY2 - d.y) < 0.1;
          })
          .transition()
          .duration(300)
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.6)
          .attr("stroke-dasharray", "5,5");

        // Hide tooltip
        tooltip
          .style("opacity", 0)
          .style("display", "none");
      })
      .on("click", function(event: any, d: InfluencerNode) {
        setSelectedInfluencer(d);
      });

    // Add node circles with improved styling
    nodeElements
      .append("circle")
      .attr("class", "node-circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.fillGradient)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .style("transition", "none"); // Disable CSS transitions for D3 animations

    // Add coin images to nodes
    nodeElements
      .append("image")
      .attr("href", (d) => d.coinImage)
      .attr("x", (d) => -d.radius * 0.7)
      .attr("y", (d) => -d.radius * 0.7)
      .attr("width", (d) => d.radius * 1.4)
      .attr("height", (d) => d.radius * 1.4)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("transition", "none"); // Disable CSS transitions for D3 animations

    // Add rank number with improved styling
    // nodeElements
    //   .append("text")
    //   .attr("class", "rank-label")
    //   .attr("x", (d) => -d.radius - 15)
    //   .attr("y", (d) => -d.radius - 15)
    //   .attr("text-anchor", "middle")
    //   .attr("dominant-baseline", "middle")
    //   .attr("fill", "white")
    //   .attr("font-weight", "bold")
    //   .attr("font-size", "14px")
    //   .attr("stroke", "#020617")
    //   .attr("stroke-width", 3)
    //   .attr("paint-order", "stroke")
    //   .text((d, i) => `#${i + 1}`);

    // Animation function
    function animateNodes() {
      // Update positions based on orbit
      influencerNodes.forEach((node) => {
        node.angle += node.speed;
        node.x = centralNode.x + node.orbitRadius * Math.cos(node.angle);
        node.y = centralNode.y + node.orbitRadius * Math.sin(node.angle);

        // Create enhanced trailing effect
        trailsGroup
          .append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", 4)
          .attr("fill", node.color)
          .attr("opacity", 0.8)
          .transition()
          .duration(2000)
          .attr("r", 1)
          .attr("opacity", 0)
          .remove();
      });

    // Update node positions
    nodeElements
      .style("transition", "none") // Disable CSS transitions for D3 animations
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Update connection lines
    connectionLines
      .style("transition", "none") // Disable CSS transitions for D3 animations
      .attr("x2", (d) => d.x)
      .attr("y2", (d) => d.y);

      // Continue animation
      requestAnimationFrame(animateNodes);
    }

    // Start animation
    animateNodes();

    // Add title with modern styling
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-size", "1.7em")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("class", "title-glow")

    // Create title glow effect
    const titleFilter = defs
      .append("filter")
      .attr("id", "title-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
      
    titleFilter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "2")
      .attr("result", "blur");
      
    titleFilter
      .append("feFlood")
      .attr("flood-color", "#3B82F6")
      .attr("result", "color");
      
    titleFilter
      .append("feComposite")
      .attr("in", "color")
      .attr("in2", "blur")
      .attr("operator", "in")
      .attr("result", "shadow");
      
    titleFilter
      .append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "shadow")
      .attr("operator", "over");
    
    // Apply filter to title
    svg.select(".title-glow").attr("filter", "url(#title-glow)");

  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
      <style jsx>{`
        .tooltip {
          background: rgba(2, 6, 23, 0.9);
          backdrop-filter: blur(10px);
          border-width: 1px;
          border-style: solid;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          transition: all 0.2s ease;
          pointer-events: none;
          z-index: 1000;
          font-size: 0.875rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          max-width: 18rem;
        }
        
        .crypto-card {
          transition: all 0.3s ease;
        }
        
        .crypto-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
      <div className="w-full text-right space-y-4 flex justify-end items-end flex-col">
      <h1 className="text-left text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-wide mb-2">
        <span className="inline-block bg-gradient-to-br from-green-300 to-white bg-clip-text text-transparent">
          Crypto Universe
        </span>
      </h1>
      <p className="text-right text-slate-600 dark:text-slate-400 text-xl font-medium mb-8">Visualizing the crypto ecosystem in real-time</p>
      </div>

      <div className="w-full max-w-6xl relative rounded-xl overflow-hidden bg-[#020617] shadow-2xl border border-blue-900">
        <svg
          ref={svgRef}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 900 600"
        ></svg>
        <div ref={tooltipRef}></div>

        <div className="absolute bottom-4 right-4 bg-[#030b20] bg-opacity-90 p-4 rounded-lg shadow-lg text-sm backdrop-blur-sm border border-blue-900">
          <p className="font-medium mb-2 text-blue-400">Universe Legend</p>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-700 mr-2"></div>
            <span>Tradesense Platform</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 flex space-x-1">
              <div className="w-1 h-4 bg-[#F7931A]"></div>
              <div className="w-1 h-4 bg-[#627EEA]"></div>
              <div className="w-1 h-4 bg-[#F3BA2F]"></div>
            </div>
            <span className="ml-2">Crypto Assets</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-[2px] bg-white opacity-20 mr-2"></div>
            <span>Orbit Paths</span>
          </div>
        </div>
      </div>
    </div>
  );
}