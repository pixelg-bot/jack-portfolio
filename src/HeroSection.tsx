import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Menu, Pause, Play, X} from 'lucide-react';
import './hero.css';
import './shopify-hero.css';

const inquiryUrl='https://www.fiverr.com/s/xrrP4ra';
const scenes = [
  {label:'Shopify Stores Built for Your Brand', subtitle:'Custom design and development that bring your vision to life and make shopping simple.', image:'/images/shopify-brand.optimized.jpg', theme:'brand', description:'Skincare storefront on desktop and mobile'},
  {label:'From First Click to Checkout', subtitle:'Thoughtful navigation, engaging product pages, and a smooth shopping experience across every device.', image:'/images/shopify-checkout.optimized.jpg', theme:'checkout', description:'Fashion shopping and checkout across devices'},
  {label:'Your Vision. Our Shopify Expertise.', subtitle:'Six years of eCommerce experience, helping brands launch new stores and refresh existing ones.', image:'/images/shopify-expertise.optimized.jpg', theme:'expertise', description:'Coffee storefront and custom design on a laptop'},
  {label:'Explore the Stores We’ve Created', subtitle:'Discover our Shopify portfolio—distinct brands, considered design, and practical solutions.', image:'/images/shopify-portfolio.optimized.jpg', theme:'portfolio', description:'Collection of storefronts for different brands'},
];

export default function HeroSection(){
  const [active,setActive]=useState(0);
  const [paused,setPaused]=useState(false);
  const [inView,setInView]=useState(true);
  const [focused,setFocused]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const reduced=useReducedMotion();
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.15});
    if(root.current)observer.observe(root.current);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(paused||reduced||!inView||focused)return;
    const timer=window.setInterval(()=>{if(!document.hidden)setActive(index=>(index+1)%scenes.length)},8000);
    return()=>window.clearInterval(timer);
  },[paused,reduced,inView,focused,active]);
  const change=(direction:number)=>setActive(index=>(index+direction+scenes.length)%scenes.length);
  const scene=scenes[active];
  const headingWords=scene.label.split(' ');
  const highlightDelay=.6+(headingWords.length-1)*.09+.15;
  return <section ref={root} className={`hero-showcase scene-${scene.theme}`} aria-label="Sandra creative portfolio" aria-roledescription="carousel" onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setFocused(false)}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();change(1)}if(e.key==='ArrowLeft'){e.preventDefault();change(-1)}}}>
    <AnimatePresence initial={false}>
      <motion.div key={active} className="scene-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:1}} aria-hidden="true">
        <picture className="scene-artwork"><source media="(max-width: 767px)" srcSet={scene.image.replace('.optimized.jpg','-mobile.optimized.jpg')}/><img src={scene.image} alt="" decoding="async" fetchPriority={active===0?'high':'auto'}/></picture>
        <div className="scene-shade"/>
      </motion.div>
    </AnimatePresence>
    <header className="showcase-header"><a className="sandra-wordmark" href="#" aria-label="Sandra home">Sandra<span className="wordmark-dot">.</span></a><nav id="showcase-navigation" className={menuOpen?'is-open':''} aria-label="Main navigation">{[['About','about'],['Services','services'],['Portfolio','portfolio'],['Contact','contact']].map(([label,id])=><a key={id} href={id==='contact'?inquiryUrl:id==='services'?'#services':`#${id}`} target={id==='contact'?'_blank':undefined} rel={id==='contact'?'noreferrer':undefined} onClick={()=>setMenuOpen(false)}>{label}</a>)}</nav><a className="contact-button showcase-consultation" href={inquiryUrl} target="_blank" rel="noreferrer">Free Consultation<ArrowUpRight size={15}/></a><button className="showcase-menu-toggle" type="button" aria-label={menuOpen?'Close navigation menu':'Open navigation menu'} aria-expanded={menuOpen} aria-controls="showcase-navigation" onClick={()=>setMenuOpen(value=>!value)}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button></header>
    <div className="showcase-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={active} className="scene-title-block" initial={reduced?false:{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
          <h1 className="banner-heading" aria-label={scene.label}>{headingWords.map((word,index)=>{const last=index===headingWords.length-1;return <span key={index} aria-hidden="true"><motion.span className={`heading-word${last?' heading-word-last':''}`} initial={reduced?false:{clipPath:'inset(0 100% 0 0)'}} animate={{clipPath:'inset(0 0% 0 0)'}} transition={{duration:.6,delay:index*.09,ease:[.22,1,.36,1]}}>{last&&<motion.span className="heading-highlight" initial={reduced?false:{scaleX:0}} animate={{scaleX:1}} transition={{duration:.5,delay:highlightDelay,ease:[.22,1,.36,1]}}/>}<motion.span className="heading-word-text" initial={false} animate={{color:last?'#10170b':'#f3f2eb'}} transition={{duration:reduced?0:.25,delay:reduced?0:highlightDelay+.15}}>{word}</motion.span></motion.span>{index<headingWords.length-1?' ':null}</span>})}</h1>
          <motion.p className="banner-subheading" initial={reduced?false:{y:14,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:reduced?0:.65,delay:reduced?0:highlightDelay+.35}}>{scene.subtitle}</motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
    <div className="showcase-bottom"><a className="explore-link" href="#portfolio">Explore the work <ArrowDown size={17}/></a><div className="slide-controls" role="group" aria-label="Slideshow controls"><button onClick={()=>change(-1)} aria-label="Previous slide"><ChevronLeft size={18}/></button><div className="slide-dots">{scenes.map((s,index)=><button key={s.theme} className={index===active?'is-active':''} onClick={()=>setActive(index)} aria-label={`Show slide ${index+1}: ${s.description}`} aria-pressed={index===active}><span>{String(index+1).padStart(2,'0')}</span><i/></button>)}</div><button onClick={()=>change(1)} aria-label="Next slide"><ChevronRight size={18}/></button><button onClick={()=>setPaused(value=>!value)} aria-label={paused?'Play slideshow':'Pause slideshow'} aria-pressed={paused}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div></div>
    <span className="sr-only" aria-live={paused||focused?'polite':'off'}>Slide {active+1} of 4: {scene.label}</span>
  </section>
}
