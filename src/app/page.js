'use client'
import styles from "./page.module.css";
import HomeHeader from '../components/HomeHeader'
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [mechanismDivVisible, setMechanismDivVisible] = useState(false);
  const mechanismDiv = useRef(null);
  const [homeDescriptionTextVisible, setHomeDescriptionTextVisible] = useState(false);
  useEffect(()=>{
    setHomeDescriptionTextVisible(true);

    const intersectionObserver = new IntersectionObserver((entries) => {
      for(const entry of entries){
        if(entry.isIntersecting){
          setMechanismDivVisible(true);
          intersectionObserver.unobserve(entry.target);
        }
      }
    }, {
      root: null,
      threshold: 0.01,
      rootMargin: '0.0%'
    });
    if(mechanismDiv.current){
      console.log("observing")
      intersectionObserver.observe(mechanismDiv.current);
    }
    return () => {
      intersectionObserver.disconnect();
    };

  }, [])
  return <>
    <HomeHeader></HomeHeader>
    <main className={styles.homeMain}>
      <h1 className={`${homeDescriptionTextVisible ? styles.visibleHomeDescriptionText : ''} + ${styles.homeDescriptionText}`}>{'NonBullShitChat\nThe Dumbass Chat App\nThat Bans Toxicity Forever!'}</h1>
      <div className={styles.homeScrollDown}>Scroll Down</div>
      <div ref={mechanismDiv} className={`${mechanismDivVisible ? styles.visibleHomeMechanismDiv : ''} ${styles.homeMechanismDiv}`}>
        <p className={styles.mechanismExplanation}>Prevents Sending Sentences With Known Toxic Slangs</p>
        <img className={styles.mechanismImage} alt="Soon"></img>
      </div>
      <div className={styles.twist}>Chat With The People You Love Using This Fast/LightWeight New Application With 0 Toxicity! I Will Put More Stuff Here Soon, What Are You Waiting For ? Try it Now Using The Login/Register Button</div>
    </main>
  </>
}
