import { BlogPost, TeamMember, Course, Review, Transformation } from './types';

export const teamMembers: TeamMember[] = [
  {
    name: 'xyz',
    role: 'Founder & Lead Artist',
    experience: '5+ Years Exp.',
    description: 'xyz founded Susbee Beauty Studio in 2026 with a dream to bring world-class beauty services to Lekhnath. With over 5 years of experience in bridal makeup, skincare, and beauty training, she has transformed hundreds of clients and trained dozens of aspiring beauty professionals across the region. Her passion is not just in making people look beautiful — but feel confident from within.',
    skills: ['Bridal Specialist', 'Skincare Expert', 'Certified Trainer', 'Hair Stylist'],
    emoji: '👩‍🎨',
    colorClass: 'from-pink-500 to-rose-700'
  },
  {
    name: 'xyz',
    role: 'Skincare Specialist',
    experience: '3 Years Exp.',
    description: 'Expert in facial treatments, deep cleansing and anti-aging skincare routines. Known for her gentle touch and outstanding results.',
    skills: ['Facials', 'Waxing', 'Skin Analysis'],
    emoji: '💆',
    colorClass: 'from-pink-400 to-pink-600'
  },
  {
    name: 'xyz',
    role: 'Hair Styling Expert',
    experience: '4 Years Exp.',
    description: 'Creative hair colorist and stylist specializing in modern cuts, balayage, and bridal hair updos for all occasions.',
    skills: ['Hair Color', 'Cutting', 'Bridal Updo'],
    emoji: '💇',
    colorClass: 'from-amber-400 to-orange-600'
  },
  {
    name: 'xyz',
    role: 'Nail Art Artist',
    experience: '2 Years Exp.',
    description: 'Talented nail technician creating stunning nail art, gel extensions, and intricate designs for every style and occasion.',
    skills: ['Gel Nails', 'Nail Art', 'Extensions'],
    emoji: '💅',
    colorClass: 'from-emerald-400 to-teal-600'
  },
  {
    name: 'xyz',
    role: 'Lash & Brow Technician',
    experience: '2 Years Exp.',
    description: 'Precision brow shaping, lash extensions, and tinting specialist. Transforms frames to perfectly enhance natural features.',
    skills: ['Lashes', 'Brows', 'Tinting'],
    emoji: '👁️',
    colorClass: 'from-purple-400 to-fuchsia-600'
  },
  {
    name: 'xyz',
    role: 'Makeup Artist',
    experience: '1 Year Exp.',
    description: 'Rising star specializing in party and event makeup. Her creative eye and steady hand deliver flawless, long-lasting looks every time.',
    skills: ['Party Makeup', 'Contouring', 'Airbrush'],
    emoji: '💄',
    colorClass: 'from-sky-400 to-blue-600'
  }
];

export const courses: Course[] = [
  {
    id: 'self-makeup',
    icon: '🌟',
    level: 'beginner',
    title: 'Self Makeup Course',
    duration: '15 Days',
    timing: 'Morning/Evening',
    hasCertificate: true,
    price: 'Rs. 10,000',
    features: [
      'Personal makeup routine',
      'Product Application techniques',
      'Day and evening looks',
      'Skin prep and base perfection',
      'Product knowledge'
    ]
  },
  {
    id: 'eyelash-extension',
    icon: '😚',
    level: 'intermediate',
    title: 'Eyelash Extension Course',
    duration: '15 Days',
    timing: 'Flexible',
    hasCertificate: true,
    price: 'Rs. 20,000',
    features: [
      'Eyelash Mapping and styles',
      'Application techniques',
      'Lash isolation and bonding',
      'Aftercare and client management'
    ]
  },
  {
    id: 'pro-makeup',
    icon: '👰',
    level: 'advanced',
    title: 'Professional Makeup Artist Program',
    duration: '45 Days',
    timing: 'Flexible',
    hasCertificate: true,
    price: 'Rs. 40,000',
    features: [
      'Self makeup and product knowledge',
      'Party makeup techniques',
      'Bridal makeup mastery',
      'Skin prep and contouring skills',
      'Client consultation and portfolio building'
    ]
  },
  {
    id: 'hair-styling',
    icon: '✂️',
    level: 'beginner',
    title: 'Hair Styling Basics',
    duration: '20 Days',
    timing: 'Morning',
    hasCertificate: true,
    price: 'Rs. 12,000',
    features: [
      'Basic haircut techniques',
      'Blow dry & styling',
      'Hair coloring fundamentals',
      'Scalp & hair treatments',
      'Tools & product usage'
    ]
  },
  {
    id: 'nail-art',
    icon: '💅',
    level: 'intermediate',
    title: 'Basic Nail Art & Extensions',
    duration: '7 Days',
    timing: 'Flexible',
    hasCertificate: true,
    price: 'Rs. 8,000',
    features: [
      'Gel & acrylic nails',
      'Nail art designs',
      'Nail extensions',
      'Manicure & pedicure',
      'Business setup tips'
    ]
  },
  {
    id: 'diploma',
    icon: '🎓',
    level: 'advanced',
    title: 'Complete Beauty Diploma',
    duration: '3 Months',
    timing: 'Full Day',
    hasCertificate: true,
    price: 'Rs. 55,000',
    features: [
      'All makeup & skincare modules',
      'Hair styling & coloring',
      'Nail art certification',
      'Business & pricing skills',
      'Job placement assistance'
    ]
  }
];

export const reviews: Review[] = [
  {
    stars: 5,
    text: 'Amazing bridal makeup and friendly service. Highly recommended!',
    author: 'Priya S.',
    location: 'Lekhnath'
  },
  {
    stars: 5,
    text: 'Best beauty studio in Lekhnath. Always satisfied with results.',
    author: 'Anita M.',
    location: 'Pokhara'
  },
  {
    stars: 5,
    text: 'Professional beauty training and great environment. Worth every penny.',
    author: 'Suman R.',
    location: 'Lekhnath'
  }
];

export const transformations: Transformation[] = [
  {
    id: 'tr1',
    title: 'Traditional Bridal Look',
    description: 'Full bridal transformation with jewelry draping assistance',
    beforeImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/rati%20after.png',
    afterImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/rati%20before.png',
    tags: ['Bridal', 'Traditional', 'Contouring']
  },
  {
    id: 'tr2',
    title: 'Modern Bridal Glow',
    description: 'Dewy skin, defined brows, bold lips — contemporary bridal style',
    beforeImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/kali%20after.png',
    afterImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/kali%20before.png',
    tags: ['Bridal', 'Modern', 'Glow']
  },
  {
    id: 'tr3',
    title: 'Festival Glam Look',
    description: 'Bold eyes, flawless skin — perfect for Dashain & Tihar celebrations',
    beforeImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    afterImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg',
    tags: ['Party', 'Glam', 'Bold Eyes']
  },
  {
    id: 'tr4',
    title: 'Evening Party Makeup',
    description: 'Smoky eye with highlight — perfect for evening events',
    beforeImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&q=80',
    tags: ['Party', 'Evening', 'Smoky']
  },
  {
    id: 'tr5',
    title: 'Hair Color & Style',
    description: 'Balayage coloring with blowdry styling finish',
    beforeImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/after%20hair.jpg',
    afterImg: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/before%20hair.jpg',
    tags: ['Hair Color', 'Styling']
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'bridal-prep',
    cat: 'bridal',
    catLabel: 'Bridal',
    title: 'Complete Bridal Beauty Prep Guide: Everything You Need to Know',
    date: 'May 2026',
    author: 'Sagar Chokhal',
    readTime: '5 min read',
    emoji: '👰',
    excerpt: "Your wedding day is the most important day of your life. Here's everything you need to do in the weeks leading up to it to look absolutely radiant. From skincare routines to the night-before checklist...",
    body: `
      <h3>6 Weeks Before the Wedding</h3>
      <p>Start your skincare routine 6 weeks before the big day. Begin with a professional facial to assess your skin, then follow a daily CTM (Cleanse, Tone, Moisturize) routine morning and night. Book your bridal consultation at Susbee to discuss your look and do a trial session.</p>
      
      <h3>4 Weeks Before</h3>
      <ul>
        <li>Start getting enough sleep — 8 hours minimum</li>
        <li>Drink 8+ glasses of water daily</li>
        <li>Reduce spicy & oily food intake</li>
        <li>Begin weekly face masks suited to your skin type</li>
        <li>Book hair spa treatment</li>
      </ul>
      
      <h3>2 Weeks Before</h3>
      <ul>
        <li>Do your bridal makeup trial at the studio</li>
        <li>Finalize jewelry and outfit for photo reference</li>
        <li>Waxing and threading appointment</li>
        <li>Deep conditioning hair treatment</li>
      </ul>
      
      <h3>Night Before the Wedding</h3>
      <ul>
        <li>Apply a hydrating sheet mask</li>
        <li>Keep hair moisturized and braided loosely</li>
        <li>Do not try any new products on your face</li>
        <li>Sleep early — 9 PM if possible!</li>
        <li>Lay out all accessories and outfit</li>
      </ul>
      
      <h3>Morning of the Wedding</h3>
      <p>Arrive at the studio fresh and makeup-free. Have a light, healthy breakfast. Bring all your jewelry, saree/outfit, and important accessories. Trust your artist — you are in expert hands at Susbee Beauty Studio!</p>
    `
  },
  {
    id: 'skin-routine',
    cat: 'skincare',
    catLabel: 'Skincare',
    title: "5 Daily Skincare Steps for Glowing Skin in Nepal's Climate",
    date: 'April 2026',
    author: 'Sagar Chokhal',
    readTime: '4 min read',
    emoji: '🧴',
    excerpt: "Nepal's dry hills and humid terai demand a different skincare approach. Here's our expert 5-step routine for every skin type...",
    body: `
      <h3>Step 1: Gentle Cleansing</h3>
      <p>Use a gentle, sulfate-free cleanser morning and night. In Nepal's dry mountain regions, avoid foaming cleansers that strip natural oils. Micellar water is great for removing pollution from Pokhara's increasing traffic.</p>
      
      <h3>Step 2: Toning</h3>
      <p>Apply a hydrating toner (not an astringent!) using a cotton pad or clean hands. Rose water is an affordable and effective toner widely available in Nepal.</p>
      
      <h3>Step 3: Serum</h3>
      <p>Use Vitamin C serum in the morning for brightening and antioxidant protection. At night, consider a retinol or niacinamide serum to address dark spots and skin texture.</p>
      
      <h3>Step 4: Moisturizer</h3>
      <p>Apply while your skin is still slightly damp. Choose a lighter formula for the humid terai season and richer cream for winter. Look for hyaluronic acid as a key ingredient.</p>
      
      <h3>Step 5: Sunscreen (AM Only)</h3>
      <p>This is non-negotiable! Nepal sits at high altitude, which means stronger UV exposure. Apply SPF 30-50 every single morning — even on cloudy days and indoors near windows.</p>
    `
  },
  {
    id: 'foundation-guide',
    cat: 'makeup',
    catLabel: 'Makeup',
    title: 'How to Choose the Right Foundation for Your Skin Tone',
    date: 'April 2026',
    author: 'Sagar Chokhal',
    readTime: '3 min read',
    emoji: '💄',
    excerpt: 'Finding your perfect foundation match can be tricky. We break down undertones, coverage levels, and finish types to find your ideal match...',
    body: `
      <h3>Identify Your Undertone</h3>
      <p>Look at the veins on your inner wrist. Blue/purple veins = cool undertone. Green veins = warm undertone. Blue-green = neutral. This is the most important factor in choosing foundation!</p>
      
      <h3>Coverage Levels</h3>
      <ul>
        <li><strong>Sheer:</strong> Best for everyday, lets skin breathe</li>
        <li><strong>Medium:</strong> Great for events, covers blemishes naturally</li>
        <li><strong>Full:</strong> Ideal for bridal and photography</li>
      </ul>
      
      <h3>Finish Types</h3>
      <ul>
        <li><strong>Matte:</strong> Best for oily skin, stays shine-free</li>
        <li><strong>Satin/Natural:</strong> Great for combination skin</li>
        <li><strong>Dewy/Luminous:</strong> Perfect for dry skin, gives glow</li>
      </ul>
      
      <h3>Testing Before Buying</h3>
      <p>Always swatch foundation on your jawline, not your hand or wrist. The right shade should disappear into your skin in natural light. Visit us at Susbee for a professional colour match consultation — it's free!</p>
    `
  },
  {
    id: 'hair-oil',
    cat: 'hair',
    catLabel: 'Hair Care',
    title: 'The Best Hair Oiling Routine for Strong, Thick Hair',
    date: 'March 2026',
    author: 'Sagar Chokhal',
    readTime: '4 min read',
    emoji: '✂️',
    excerpt: "Grandmothers were right all along! Hair oiling is a centuries-old secret for strong, shiny hair. Here's exactly how and when to do it...",
    body: `
      <h3>Best Oils for Nepali Hair</h3>
      <ul>
        <li><strong>Coconut oil:</strong> Penetrates the hair shaft, reduces protein loss, widely available</li>
        <li><strong>Mustard oil:</strong> Traditional Nepali choice, stimulates scalp circulation</li>
        <li><strong>Castor oil:</strong> Thick and nourishing, great for hair growth</li>
        <li><strong>Argan oil:</strong> Lightweight, adds shine without greasiness</li>
      </ul>
      
      <h3>How to Apply</h3>
      <p>Warm the oil slightly (not hot) between your palms. Apply to scalp first in sections, massaging with fingertips in circular motions for 5-10 minutes. Then distribute through the lengths of your hair.</p>
      
      <h3>How Long to Leave It</h3>
      <p>Minimum 1-2 hours. Ideally overnight for deep conditioning. Cover with a silk or satin scarf to protect your pillowcase and improve absorption.</p>
      
      <h3>How Often</h3>
      <p>1-2 times per week is ideal. Over-oiling can clog scalp pores. For dry or damaged hair, twice weekly. For oily scalp, stick to once weekly on lengths only.</p>
      
      <h3>Washing Out</h3>
      <p>Apply shampoo directly to oily hair before water — this breaks down the oil much better. You may need to shampoo twice. Follow with a lightweight conditioner on mid-lengths and ends only.</p>
    `
  },
  {
    id: 'nail-care',
    cat: 'nails',
    catLabel: 'Nails',
    title: 'How to Make Your Manicure Last 2 Weeks at Home',
    date: 'March 2026',
    author: 'Sagar Chokhal',
    readTime: '3 min read',
    emoji: '💅',
    excerpt: 'Nail polish chipping after 2 days? Follow these professional salon tips to keep your manicure looking fresh and chip-free for weeks...',
    body: `
      <h3>Prep Is Everything</h3>
      <p>Push back cuticles gently and buff your nails lightly. Wipe with acetone before applying any polish — this removes oils and ensures the polish bonds properly. Skipping this is the #1 reason nails chip fast.</p>
      
      <h3>Base Coat First — Always</h3>
      <p>A quality base coat protects your nails, evens the surface, and gives the polish something to grip. Never skip this step! Apply one thin coat and let it dry fully.</p>
      
      <h3>Thin Coats Win</h3>
      <p>Apply 2-3 thin coats instead of 1 thick coat. Thick coats take much longer to dry and peel easily. Each coat should look slightly translucent on its own.</p>
      
      <h3>Cap the Free Edge</h3>
      <p>After each coat, swipe the brush along the very tip (edge) of the nail. This seals the polish and prevents chipping at the tips — the most common breakage point.</p>
      
      <h3>Top Coat Every 2-3 Days</h3>
      <p>Reapply a clear top coat every 2-3 days. This refreshes shine and adds a new layer of chip protection without redoing the entire manicure.</p>
      
      <h3>Protect Your Hands</h3>
      <p>Wear gloves when doing dishes or cleaning. Water and chemicals are the enemy of a long-lasting manicure. Also avoid using your nails as tools!</p>
    `
  },
  {
    id: 'rice-water',
    cat: 'skincare',
    catLabel: 'Skincare',
    title: 'Rice Water: The Ancient Secret for Hair & Skin in Nepal',
    date: 'February 2026',
    author: 'Sagar Chokhal',
    readTime: '3 min read',
    emoji: '🌾',
    excerpt: "Used for centuries across Asia, rice water offers amazing benefits for both hair and skin. Here's how to make and use it correctly...",
    body: `
      <h3>What Is Rice Water?</h3>
      <p>Rice water is the starchy liquid left over from soaking or boiling rice. It contains vitamins B, C, E, minerals, and amino acids that nourish both skin and hair.</p>
      
      <h3>For Hair</h3>
      <ul>
        <li>Rinse hair with rice water after shampooing</li>
        <li>Leave for 15-20 minutes then rinse out</li>
        <li>Does weekly for shiny, strong, less frizzy hair</li>
        <li>Reduces split ends and promotes growth</li>
      </ul>
      
      <h3>For Skin</h3>
      <ul>
        <li>Use as a toner after cleansing</li>
        <li>Apply with cotton pad, leave to absorb</li>
        <li>Brightens skin tone and reduces dark spots</li>
        <li>Soothes irritated or sunburned skin</li>
      </ul>
      
      <h3>How to Make It</h3>
      <p>Soak 1 cup of uncooked rice in 2 cups of clean water for 30 minutes. Strain and store the water in a glass jar in the refrigerator for up to a week. You can also let it ferment for 24-48 hours for enhanced benefits — but start with fresh if you have sensitive skin.</p>
    `
  },
  {
    id: 'no-makeup',
    cat: 'makeup',
    catLabel: 'Makeup',
    title: 'The Perfect "No-Makeup" Makeup Look for Everyday',
    date: 'January 2026',
    author: 'Sagar Chokhal',
    readTime: '3 min read',
    emoji: '🌸',
    excerpt: 'Look naturally beautiful without looking like you tried too hard. This effortless technique enhances your features while keeping things light...',
    body: `
      <h3>Skincare First</h3>
      <p>A great no-makeup look starts with great skin. Moisturize well, and let it absorb for 5 minutes before starting makeup. Well-hydrated skin makes any product look more natural.</p>
      
      <h3>Tinted Moisturizer or BB Cream</h3>
      <p>Skip full foundation. Use a lightweight tinted moisturizer or BB cream that matches your skin tone. Apply with clean fingers for the most natural, skin-like finish.</p>
      
      <h3>Concealer Only Where Needed</h3>
      <p>Spot-conceal blemishes, under-eye darkness, and redness only. Blend outward with a damp beauty sponge. Less is more — only cover what actually needs coverage.</p>
      
      <h3>Cream Blush for Natural Flush</h3>
      <p>A soft pink or peach cream blush on the apples of the cheeks blends seamlessly into skin. Smile gently, apply, then blend upward toward your temples.</p>
      
      <h3>Clear Brow Gel</h3>
      <p>Brush your brows into shape with a clear gel — this frames your face without looking "done." Fill very sparse areas with feathery hairlike strokes only if needed.</p>
      
      <h3>Tinted Lip Balm to Finish</h3>
      <p>A sheer, tinted lip balm adds a hint of color while keeping lips moisturized. A peachy-pink or your-lips-but-better MLBB shade completes the effortless look.</p>
    `
  }
];

export const quickTips = [
  { num: '01', title: 'Moisturize on damp skin', text: 'Apply moisturizer within 60 seconds of washing your face to lock in maximum hydration.' },
  { num: '02', title: 'Always use sunscreen', text: 'Even on cloudy days in Nepal, UV rays are strong at altitude. SPF 30+ daily is non-negotiable.' },
  { num: '03', title: 'Set liner with shadow', text: 'Dab matching eyeshadow over your liner to make it smudge-proof and last all day long.' },
  { num: '04', title: 'Cold water for hair', text: 'Rinse hair with cold water after washing to seal the cuticle for extra shine and smoothness.' },
  { num: '05', title: 'Lipstick last longer', text: 'Apply lipstick, blot with tissue, dust with translucent powder, then apply another layer for all-day wear.' },
  { num: '06', title: 'Drink water for skin', text: '8 glasses of water daily improves skin elasticity, reduces breakouts, and gives natural glow.' }
];

export const hairCareFaqs = [
  { q: 'Which shampoo is best for hair in Nepal?', a: 'Best shampoo depends on your hair type and whatever suits your hair the best.' },
  { q: 'What is the best hair care routine?', a: 'Oiling your hair regularly, brushing and detangling your hair and using a scalp massager is the best hair care routine.' },
  { q: 'Should I oil my hair daily?', a: 'Oiling your hair once or twice a week is good enough for your hair.' },
  { q: 'How to increase hair volume?', a: 'You can increase your hair volume by taking care of your diet and using the right products.' },
  { q: 'Is rice water good for hair?', a: 'Rice water is considered good for all hair types and helps grow silky hair.' }
];

export const trainingFaqs = [
  { q: 'Do I need prior experience to join?', a: 'No prior experience is needed for beginner courses. For advanced courses, some basic knowledge is helpful but not mandatory.' },
  { q: 'Are certificates recognized?', a: 'Yes! Our certificates are issued by Susbee Beauty Studio and Training Center, a recognized institution in Lekhnath, Pokhara area.' },
  { q: 'What are the class timings?', a: 'We offer flexible morning (8 AM–12 PM) and afternoon (1 PM–5 PM) batches. Timing can be discussed based on your availability.' },
  { q: 'Is there an EMI / installment option?', a: 'Yes, for courses above Rs. 15,000 we offer a 2-installment payment option. Please contact us for details.' }
];
