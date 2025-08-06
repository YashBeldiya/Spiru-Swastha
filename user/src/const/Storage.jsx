import immu from '../assets/img/navbar/immune.svg';
import skin from '../assets/img/navbar/skin.svg';
import heart from '../assets/img/navbar/heart.svg';
import hair from '../assets/img/navbar/hair.svg';
import well from '../assets/img/navbar/wellness.svg';
import clean from '../assets/img/navbar/cleashing.svg';
import hero1 from '../assets/img/hero1.jpg'
import hero2 from '../assets/img/hero2.jpg'
import hero3 from '../assets/img/hero3.jpg'
import hero4 from '../assets/img/hero4.jpg'
import hero5 from '../assets/img/hero5.jpg'
import hero6 from '../assets/img/hero6.jpg'
import immunity from '../assets/img/Iimmunity.svg'
import skincare from '../assets/img/Skin.svg'
import haircare from '../assets/img/Hair.svg'
import heartcare from '../assets/img/Heart.svg'
import strength from '../assets/img/Strength.svg'
import cleansing from '../assets/img/cleansign.svg'
import pro1 from '../assets/img/Products/product1.webp'
import pro2 from '../assets/img/Products/product2.webp'
import pro3 from '../assets/img/Products/product3.webp'
import pro4 from '../assets/img/Products/product4.webp'
import pro5 from '../assets/img/Products/product5.webp'
import pro6 from '../assets/img/Products/product6.webp'
import pro7 from '../assets/img/Products/product7.webp'
import pro8 from '../assets/img/Products/product8.webp'
import pro1hover from '../assets/img/Products/product12.webp'
import pro2hover from '../assets/img/Products/product21.webp'
import pro3hover from '../assets/img/Products/product31.webp'
import pro4hover from '../assets/img/Products/product41.webp'
import pro5hover from '../assets/img/Products/product51.webp'
import pro6hover from '../assets/img/Products/product61.webp'
import pro7hover from '../assets/img/Products/product71.webp'
import pro8hover from '../assets/img/Products/product81.webp'
import bowlIcon from '../assets/img/bowlIcon.svg'
import leafIcon from '../assets/img/leafIcon.svg'
import yogaIcon from '../assets/img/yogaIcon.svg'
import stethoscopeIcon from '../assets/img/stethoscopeIcon.svg'
import tab1 from '../assets/img/tabs/tab1.webp'
import tab2 from '../assets/img/tabs/tab2.webp'
import tab3 from '../assets/img/tabs/tab3.webp'
import tab4 from '../assets/img/tabs/tab4.webp'
import organic from "../assets/img/superfood1.avif";
import eco from "../assets/img/superfood2.webp";
import vegan from "../assets/img/superfood3.avif";
import quality from "../assets/img/superfood4.avif";
import blog1 from '../assets/img/Blog/blog1.webp'
import blog2 from '../assets/img/Blog/blog2.webp'
import blog3 from '../assets/img/Blog/blog3.webp'
import blog4 from '../assets/img/Blog/blog4.webp'
import blog5 from '../assets/img/Blog/blog5.webp'
import blog6 from '../assets/img/Blog/blog5.webp'
import traPro1 from '../assets/img/transition-pro1.webp'
import traPro2 from '../assets/img/transition-pro2.webp'
import traPro3 from '../assets/img/transition-pro3.webp'
import traPro4 from '../assets/img/transition-pro4.webp'
import traPro5 from '../assets/img/transition-pro5.webp'
import traPro6 from '../assets/img/transition-pro6.webp'
import traPro7 from '../assets/img/transition-pro7.webp'
import visa from '../assets/img/Payment/visa.svg'
import master from '../assets/img/Payment/master.svg'
import maestro from '../assets/img/Payment/maestro.svg'
import rupay from '../assets/img/Payment/rupay.svg'
import upi from '../assets/img/Payment/upi.svg'
import netbanking from '../assets/img/Payment/netbanking.svg'
import gpay from '../assets/img/Payment/gpay.svg'
import payzapp from '../assets/img/Payment/payzapp.svg'

import health from '../assets/img/Blog/health.svg'
import ayurved from '../assets/img/Blog/ayurved.svg'
import real_assis from '../assets/img/Blog/real-assis.svg'
import natural from '../assets/img/Blog/natural.svg'

 // navbar
export const navlist = [
    { img: immu, title: "Immunity" },
    { img: skin, title: "Skin Care" },
    { img: hair, title: "Hair Care" },
    { img: heart, title: "Heart Care" },
    { img: well, title: "Wellness" },
    { img: clean, title: "Cleansing" },
    { img: 'https://cdn-icons-png.flaticon.com/512/891/891462.png', title: "Track Your Order" }
  ];

  // carousel 
export const carouselList = [
    {img : hero1},
    {img : hero2},
    {img : hero3},
    {img : hero4},
    {img : hero5},
    {img : hero6}
]

// categories
export const categories = [
    {img : immunity,title:"Immunity",slug:"immunity"},
    {img : skincare,title:"Skin Care",slug:"skin-care"},
    {img : haircare,title:"Hair Care",slug:"hair-care"},
    {img : heartcare,title:"Heart Care",slug:"heart-care"},
    {img : strength,title:"Wellness",slug:"wellness"},
    {img : cleansing,title:"Cleansing",slug:"cleansign"}
]

// best seller
export const bestSellerProduct = [
    { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'SPIRULINA TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF',slug:"spirulina-tablets-for-kids" },
    { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
    { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: 599, newPrice: 319, discount: '20% OFF',slug:"spirulina-powder" },
    { id: 4, proImage: pro4, hoverImage: pro4hover, title: 'SPIRULINA CAPSULES', oldPrice: 599, newPrice: 479, discount: '20% OFF' },
    { id: 5, proImage: pro5, hoverImage: pro5hover, title: 'MORINGA LEAF TABLETS', oldPrice: 499, newPrice: 399, discount: '20% OFF' },
    { id: 6, proImage: pro6, hoverImage: pro6hover, title: 'MORINGA LEAF POWDER', oldPrice: 299, newPrice: 239, discount: '20% OFF' },
    { id: 7, proImage: pro7, hoverImage: pro7hover, title: 'SPIRUVITA HAIR OIL', oldPrice: null, newPrice: '₹149.00 – ₹399.00', discount: null },
    { id: 8, proImage: pro8, hoverImage: pro8hover, title: 'SPIRULINA TABLET', oldPrice: 499, newPrice: 424, discount: '15% OFF' },
  ];

// spiru transition
export  const productsslider = [
  {
    id: 1,
    views: 67,
    title: 'Spiru Shine Shampoo',
    price: 239,
    originalPrice: 299,
    video1 : "https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_e2ee1906-1846-49f4-8851-8afe74b427b5.mp4?v=1744190368",
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_e2ee1906-1846-49f4-8851-8afe74b427b5.mp4?v=1744190375',
    productImage: traPro1,
  },
  {
    id: 2,
    views: 289,
    title: 'Natural Spirulina Tablet',
    price: 424,
    originalPrice: 499,
    video1: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_c64097d6-fd0d-4d20-ad94-99b98138b64a.mp4?v=1739861238',
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_c64097d6-fd0d-4d20-ad94-99b98138b64a.mp4?v=1739861245',
    productImage: traPro2,
  },
  {
    id: 3,
    views: 254,
    title: 'Natural Spirulina Powder',
    price: 319,
    originalPrice: 399,
    video1:'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_13d16737-6683-4bde-a6c9-d04d6c94f0b2.mp4?v=1739158904',
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_13d16737-6683-4bde-a6c9-d04d6c94f0b2.mp4?v=1739158911',
    productImage: traPro3,
  },
  {
    id: 4,
    views: 306,
    title: 'Spiruvita Hair Oil',
    price: 149,
    video1:'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_c3e12651-28e1-424a-bd86-daf9b2175354.mp4?v=1739159655',
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_c3e12651-28e1-424a-bd86-daf9b2175354.mp4?v=1739159663',
    productImage: traPro4,
  },
  {
    id: 5,
    views: 172,
    title: 'Arjun Chaal Tablets For Heart',
    price: 399,
    originalPrice: 499,
    video1:'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_8d3a3ef8-0cda-4c6b-8ce6-feb96ad02f3a.mp4?v=1740456053',
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_8d3a3ef8-0cda-4c6b-8ce6-feb96ad02f3a.mp4?v=1740456060',
    productImage: traPro5,
  },
  {
    id: 6,
    views: 259,
    title: 'Natural Spirulina Powder',
    price: 319,
    originalPrice: 399,
    video1:'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_41cc0459-29c4-4255-9836-e2c4719ee73c.mp4?v=1739159443',
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_41cc0459-29c4-4255-9836-e2c4719ee73c.mp4?v=1739159450',
    productImage: traPro6,
  },
  {
    id: 7,
    views: 274,
    title: 'Natural Ashwagandha Tablets',
    price: 399,
    originalPrice: 499,
    video1:'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_1080p_d2c06994-608a-4d9e-a211-9f8143aed366.mp4?v=1739525186',
    video: 'https://cdn.shopify.com/s/files/1/0611/1038/6771/files/whatmore_tn_d2c06994-608a-4d9e-a211-9f8143aed366.mp4?v=1739525196',
    productImage: traPro7,
  },
];

  // 4 balance
 export const balanceData = [
    {
      icon: bowlIcon,
      title: 'Ayurvedic Products',
      description: 'That can easily integrate into your daily life',
    },
    {
      icon: yogaIcon,
      title: 'Lifestyle Recommendations',
      description: 'Complement it with yoga asanas for maximum benefit',
    },
    {
      icon: leafIcon,
      title: 'Wellness Tips',
      description: 'Blogs on Daily Ayurvedic self-care practices to enhance well-being.',
    },
    {
      icon: stethoscopeIcon,
      title: 'Expert Connect',
      description: 'Reach out to our ayurveda experts, for free at spiruswastha@gmail.com',
    },
  ];

  // spiruswastha tabs
  export const spiruTabsData = [
    {
      label: "Why SpiruSwastha?",
      content: (
        <>
          <p>
            Are you searching for <em>"how to increase energy naturally"</em> or <em>"an easy way to improve immunity"</em>? Then Spiru Swastha has the perfect answer for you! In today's fast-paced life, where junk food and nutritional gaps are common, we bring you nature's original superfood—Spirulina. It is so powerful and trusted that even NASA uses it to keep its astronauts healthy in space.
          </p>
          <br />
          <p>
            Spiru Swastha has just one goal: to deliver 100% pure, natural, and effective Spirulina to you. We produce it hygienically right here in India, at a price that fits your budget. Every product of ours meets the highest quality standards, so you can easily fill your nutritional gaps and live a more energetic and healthy life.
          </p>
        </>
      ),
      image: tab1,
    },
    {
      label: "What do we offer?",
      content: (
        <>
          <p>
            Spiru Swastha offers 100% natural and pure Spirulina, nature's most powerful superfood. It is a simple, effective solution for your daily health needs, helping you boost your energy, build strong immunity, and fill the nutritional gaps caused by today’s fast-paced lifestyle.
          </p>
          <br />
          <p>
            All our products are made in our own modern and hygienic facility in India. We have strict quality checks at every single step—from carefully growing the algae to packing the final product. This ensures that you get only the purest Spirulina, with no added chemicals or fillers.
          </p>
        </>
      ),
      image: tab2,
    },
    {
      label: "Our Beginning and Our Promise",
      content: (
        <>
          <p>
            Spiru Swastha was founded in 2023 by Mr. Mahesh Patel with a clear and modern mission. He saw that our busy lives and modern eating habits often leave us feeling tired and weak. Our journey began with a simple idea: to provide a pure, natural solution to fill this nutritional gap and bring good health back into every Indian household.
          </p>
          <br />
          <p>
            While our journey has just begun, our commitment is already making a difference. We started with a dream and quickly turned it into a reality, now hygienically producing over 500 kg of pure Spirulina every month. This is our promise to you: we will always focus on quality over quantity, ensuring every pack of Spiru Swastha you receive is pure, effective, and made with complete honesty.
          </p>
        </>
      ),
      image: tab3,
    },
    {
      label: "Our Promise to Your Health",
      content: (
        <>
          <p>
            At Spiru Swastha, our promise is to make a real difference in your daily health and energy. We believe that the answer to our modern lifestyle problems, like low energy and poor nutrition, lies in nature's most powerful gifts. That’s why we are dedicated to ensuring every pack of our Spirulina is 100% pure, natural, and effective, so you can easily take a step towards a healthier and more active life.
          </p>
        </>
      ),
      image: tab4,
    },
  ];

  //super food
 export const superfoodData = [
    { img: organic, label: "Pure Potent Superfoods" },
    { img: eco, label: "Sustainably Sourced Ingredients" },
    { img: vegan, label: "Nutrient Dense Formulas" },
    { img: quality, label: "Quality You Can Trust" },
];

// blog
export const blogPostsData = [
  {
      title: "Spirulina Scrub for Deep Cleansing, Dead Skin Removal, and Glowing Skin",
      description:
          "Healthy and glowing skin is something everyone desires. But, pollution, dirt, and dead skin cells often make our sk...",
      image: blog1,
  },
  {
      title: "Spirulina Tablets for Kids: Benefits for Energy, Focus & Overall Wellness",
      description:
          "We always want the best for our kids as parents. We want them to be happy, healthy, active, and focused. But with ...",
      image: blog2,
  },
  {
      title: "Spirulina Tablets for Kids: Uses for Growth, Immunity & Brain Development",
      description:
          "As parents, we all want the best for our children—whether it’s their physical health, mental well-being, or overall...",
      image: blog3,
  },
  {
      title: "Spirulina Scrub for Deep Cleansing, Dead Skin Removal, and Glowing Skin",
      description:
          "Healthy and glowing skin is something everyone desires. But, pollution, dirt, and dead skin cells often make our sk...",
      image: blog4,
  },
  {
      title: "Spirulina Tablets for Kids: Benefits for Energy, Focus & Overall Wellness",
      description:
          "We always want the best for our kids as parents. We want them to be happy, healthy, active, and focused. But with ...",
      image: blog5,
  },
  {
      title: "Spirulina Tablets for Kids: Uses for Growth, Immunity & Brain Development",
      description:
          "As parents, we all want the best for our children—whether it’s their physical health, mental well-being, or overall...",
      image: blog6,
  },
];

// collection array 
export const collection_array = [
  {
    slug:"immunity",
    products : [
      { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
      { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
      { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    ]
  },
  {
    slug :"skin-care",
    products : [
      { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
      { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
      { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    ]
  },
  {
    slug :"hair-care",
    products : [
      { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
      { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
      { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    ]
  },
  {
    slug :"heart-care",
    products : [
      { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
      { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
      { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    ]
  },
  {
    slug :"wellness",
    products : [
      { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
      { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
      { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    ]
  },
  {
    slug :"cleansign",
    products : [
      { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
      { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
      { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    ]
  }
]

// related product 

export const relatedProducts = [
    { id: 1, proImage: pro1, hoverImage: pro1hover, title: 'Spirulina TABLETS FOR KIDS', oldPrice: 350, newPrice: 315, discount: '10% OFF' },
    { id: 2, proImage: pro2, hoverImage: pro2hover, title: 'SHILAJIT RESIN', oldPrice: 1599, newPrice: 1200, discount: '25% OFF' },
    { id: 3, proImage: pro3, hoverImage: pro3hover, title: 'SPIRULINA POWDER', oldPrice: null, newPrice: '₹319 - ₹1,875.00', discount: '20% OFF' },
    { id: 4, proImage: pro4, hoverImage: pro4hover, title: 'SPIRULINA CAPSULES', oldPrice: 599, newPrice: 479, discount: '20% OFF' }
]

export const paymentMethods = [
  {img : visa},
  {img : master},
  {img : maestro},
  {img : rupay},
  {img : upi},
  {img : netbanking},
  {img : gpay},
  {img : payzapp}
]

// why spiruswastha - product details
export const features = [
  {
    icon : health,
    title: "Health Outcomes",
    description: "Ayurvedic solutions delivered thoughtfully",
  },
  {
    icon: ayurved,
    title: "Bespoke Ayurveda",
    description: "Programs Crafted by Ayurvedacharayas",
  },
  {
    icon: real_assis,
    title: "Real Assistance",
    description: "Ayurvedic Health Experts",
  },
  {
    icon: natural,
    title: "Natural Ingredients",
    description: "Carefully handpicked and sourced",
  },
];
