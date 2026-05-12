import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const schemes = [
  {
    name: {
      en: 'Gruhnirman Ramai Avas Yojana',
      mr: 'गृहनिर्माण रामाई आवास योजना'
    },
    description: {
      en: 'Housing scheme for affordable construction assistance for economically weaker sections',
      mr: 'आर्थिकदृष्ट्या कमजोर वर्गांसाठी घर बांधण्यासाठी सहाय्य प्रदान करणारी योजना'
    },
    category: 'infrastructure',
    eligibility: {
      en: [
        'Annual income less than 5 lakhs',
        'Owned land or approved plot',
        'No existing pucca house in family name'
      ],
      mr: [
        'वार्षिक उत्पन्न ५ लाख रुपये पर्यंत',
        'स्वतःचा जमीन किंवा मंजूर केलेला प्लॉट',
        'कुटुंबाच्या नावावर कोणतेही पक्का घर नाही'
      ]
    },
    benefits: {
      en: [
        'Up to 1.5 lakhs rupees financial assistance',
        'Low-interest loans available',
        'Technical support for construction'
      ],
      mr: [
        '१.५ लाख रुपये पर्यंत आर्थिक सहाय्य',
        'कमी व्याज दरांवर कर्ज उपलब्ध',
        'बांधकामासाठी तांत्रिक सहाय्य'
      ]
    },
    applicationProcess: {
      en: 'Apply at Gram Panchayat office with required documents including income certificate, land ownership proof, and identity proof.',
      mr: 'उत्पन्न प्रमाणपत्र, जमीन मालकीचा पुरावा आणि ओळखपत्र असलेले आवश्यक कागदपत्र घेऊन ग्राम पंचायत कार्यालयात अर्ज करा.'
    },
    contactInfo: {
      department: 'Gram Panchayat Housing Department',
      phone: '9876543210',
      email: 'housing@grampanchayat.gov.in'
    }
  },
  {
    name: {
      en: 'Shabari Adivasi Gharkul Yojana',
      mr: 'शबरी आदिवासी घरकुल योजना'
    },
    description: {
      en: 'Housing scheme exclusively for Adivasi community members',
      mr: 'आदिवासी समुदायातील सदस्यांसाठी विशेषतः आवास योजना'
    },
    category: 'social',
    eligibility: {
      en: [
        'Must be registered Adivasi with valid ST certificate',
        'Annual income less than 3 lakhs',
        'No pucca house ownership'
      ],
      mr: [
        'वैध ST प्रमाणपत्र असलेले नोंदणीकृत आदिवासी',
        'वार्षिक उत्पन्न ३ लाख रुपये पर्यंत',
        'पक्का घर मालकीचा अधिकार नाही'
      ]
    },
    benefits: {
      en: [
        'Up to 2.5 lakhs rupees assistance',
        'Priority processing',
        'Exemption from certain fees'
      ],
      mr: [
        '२.५ लाख रुपये पर्यंत सहाय्य',
        'प्राधान्य क्रमवारी प्रक्रिया',
        'विशिष्ट शुल्कांमधून सवलत'
      ]
    },
    applicationProcess: {
      en: 'Apply with ST certificate, income proof, and land ownership documents to Gram Panchayat Adivasi Welfare Office.',
      mr: 'ST प्रमाणपत्र, उत्पन्न पुरावा आणि जमीन दस्तऐवज घेऊन ग्राम पंचायत आदिवासी कल्याण कार्यालयात अर्ज करा.'
    },
    contactInfo: {
      department: 'Gram Panchayat Adivasi Welfare',
      phone: '9876543211',
      email: 'adivasi@grampanchayat.gov.in'
    }
  },
  {
    name: {
      en: 'Pradhanmantri Avas Yojana',
      mr: 'प्रधानमंत्री आवास योजना'
    },
    description: {
      en: 'Central government scheme for housing for all economically weaker sections',
      mr: 'आर्थिकदृष्ट्या कमजोर वर्गांसाठी केंद्र सरकारची राष्ट्रव्यापी आवास योजना'
    },
    category: 'infrastructure',
    eligibility: {
      en: [
        'Annual family income up to 6 lakhs',
        'No family member owns pucca house',
        'SC/ST/OBC/minority category preference'
      ],
      mr: [
        'कुटुंबाची वार्षिक उत्पन्न ६ लाख रुपये पर्यंत',
        'कुटुंबातील कोणीही पक्का घर मालक नाही',
        'अनुसूचित जाती/जनजाती/इतर पिछडा वर्ग/अल्पसंख्यक वर्गाला प्राधान्य'
      ]
    },
    benefits: {
      en: [
        'Up to 2 lakhs rupees central assistance',
        'State government assistance available',
        'Markup subsidy on loans'
      ],
      mr: [
        '२ लाख रुपये पर्यंत केंद्रीय सहाय्य',
        'राज्य सरकारचा सहाय्य उपलब्ध',
        'कर्जावर मार्कअप सबसिडी'
      ]
    },
    applicationProcess: {
      en: 'Register online at official PM Avas Yojana portal or apply at Gram Panchayat with income certificate and identity proof.',
      mr: 'अधिकृत PM आवास योजना पोर्टलवर ऑनलाइन नोंदणी करा किंवा उत्पन्न प्रमाणपत्र आणि ओळखपत्र घेऊन ग्राम पंचायतात अर्ज करा.'
    },
    contactInfo: {
      department: 'Pradhanmantri Avas Yojana Cell',
      phone: '9876543212',
      email: 'pmavas@grampanchayat.gov.in'
    }
  },
  {
    name: {
      en: 'Samridh Gram Yojana',
      mr: 'समृद्ध ग्राम योजना'
    },
    description: {
      en: 'Integrated rural development scheme for holistic village development',
      mr: 'गावांच्या सर्वांगीण विकासासाठी समेकित ग्रामीण विकास योजना'
    },
    category: 'social',
    eligibility: {
      en: [
        'Village population less than 5000',
        'Community participation mandatory',
        'No pending litigation in village'
      ],
      mr: [
        'गावची लोकसंख्या ५००० पर्यंत',
        'समुदायाचा सहभाग अनिवार्य',
        'गावात कोणतेही प्रलंबित खटला नाही'
      ]
    },
    benefits: {
      en: [
        'Community infrastructure development',
        'Skills training for villagers',
        'Microfinance support'
      ],
      mr: [
        'सामुदायिक अवस्थापना विकास',
        'ग्रामीणांसाठी कौशल्य प्रशिक्षण',
        'सूक्ष्मवित्त सहाय्य'
      ]
    },
    applicationProcess: {
      en: 'Submit application through Gram Panchayat with village development plan and community approval.',
      mr: 'गाव विकास योजना आणि समुदायाची मंजूरी घेऊन ग्राम पंचायतमार्फत अर्ज सादर करा.'
    },
    contactInfo: {
      department: 'Rural Development Cell',
      phone: '9876543213',
      email: 'samridh@grampanchayat.gov.in'
    }
  },
  {
    name: {
      en: 'Mukhyamantri Gram Sadak Yojana',
      mr: 'मुख्यमंत्री ग्राम सड़क योजना'
    },
    description: {
      en: 'State scheme for connecting villages with all-weather road network',
      mr: 'गावांना सर्वकाळीन रस्त्यांच्या नेटवर्कशी जोडण्यासाठी राज्य योजना'
    },
    category: 'infrastructure',
    eligibility: {
      en: [
        'Village not connected with paved road',
        'Population of at least 500 persons',
        'Community contribution as per guidelines'
      ],
      mr: [
        'गावला पक्की रस्त्याने जोडलेले नाही',
        'किमान ५०० लोकांची लोकसंख्या',
        'दिशानिर्देशांनुसार समुदायाचा योगदान'
      ]
    },
    benefits: {
      en: [
        'Government funded road construction',
        'Improved transportation access',
        'Reduced travel time to markets'
      ],
      mr: [
        'सरकार अर्थायोजनाने रस्ता बांधणे',
        'सुधारित वाहतूक सुविधा',
        'बाजारपेठेला कमी प्रवास काळ'
      ]
    },
    applicationProcess: {
      en: 'Apply through Gram Panchayat with community undertaking and technical feasibility report.',
      mr: 'समुदायाचा हमीद आणि तांत्रिक व्यवहार्यता अहवालासह ग्राम पंचायतमार्फत अर्ज करा.'
    },
    contactInfo: {
      department: 'Rural Road Development Authority',
      phone: '9876543214',
      email: 'gramsadak@grampanchayat.gov.in'
    }
  },
  {
    name: {
      en: 'Swachh Bharat Mission',
      mr: 'स्वच्छ भारत मिशन'
    },
    description: {
      en: 'National cleanliness campaign for sanitation and waste management',
      mr: 'स्वच्छता आणि कचरा व्यवस्थापनासाठी राष्ट्रीय शुद्धता अभियान'
    },
    category: 'social',
    eligibility: {
      en: [
        'All citizens and institutions',
        'Villages aiming for open defecation free status',
        'Community organizations can apply'
      ],
      mr: [
        'सर्व नागरिक आणि संस्था',
        'खुल्या शौचमुक्त स्थितीचा लक्ष्य घेणारी गावे',
        'सामुदायिक संस्था अर्ज करू शकतात'
      ]
    },
    benefits: {
      en: [
        'Toilet construction financial assistance',
        'Awareness programs and training',
        'Recognition and awards for best performers'
      ],
      mr: [
        'शौचालय बांधण्यासाठी आर्थिक सहाय्य',
        'जागरूकता कार्यक्रम आणि प्रशिक्षण',
        'सर्वोत्तम कार्यक्षमतेसाठी मान्यता आणि पुरस्कार'
      ]
    },
    applicationProcess: {
      en: 'Register on Swachh Bharat Mission portal or apply at Gram Panchayat with proposed action plan.',
      mr: 'स्वच्छ भारत मिशन पोर्टलवर नोंदणी करा किंवा प्रस्तावित कृती योजनासह ग्राम पंचायतात अर्ज करा.'
    },
    contactInfo: {
      department: 'Sanitation and Cleanliness Cell',
      phone: '9876543215',
      email: 'swachh@grampanchayat.gov.in'
    }
  }
];

async function seedSchemes() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gram-panchayat';
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Find an admin user to use as createdBy
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Creating a default admin user...');
      adminUser = await User.create({
        name: 'System Admin',
        username: 'admin',
        email: 'admin@grampanchayat.gov.in',
        password: 'Admin@123', // This will be hashed by the model pre-save hook
        role: 'admin'
      });
    }

    // Delete existing schemes
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes');

    // Add schemes with createdBy
    const schemesWithCreatedBy = schemes.map(scheme => ({
      ...scheme,
      createdBy: adminUser._id
    }));

    const createdSchemes = await Scheme.insertMany(schemesWithCreatedBy);
    console.log(`Successfully seeded ${createdSchemes.length} schemes with bilingual content`);

    // Display created schemes
    console.log('\n📋 Created Schemes:');
    createdSchemes.forEach((scheme, index) => {
      console.log(`\n${index + 1}. ${scheme.name.en} / ${scheme.name.mr}`);
      console.log(`   Category: ${scheme.category}`);
    });

    await mongoose.disconnect();
    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Error seeding schemes:', error);
    process.exit(1);
  }
}

seedSchemes();
