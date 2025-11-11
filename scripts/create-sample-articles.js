/**
 * Create Sample Articles for PetStar Website
 * This script creates 3 sample articles in Strapi CMS
 */

const API_URL = 'https://api.petstar-dash.ro/api';
const API_TOKEN = 'ca6086b9ec38b156a1a00d407c52593fb7ed2483a01d0c2a0428197574d092b3dfc37ced947681c4616fb9cbf2180601dddc49e20030069c342eecb9a63f6bba66b140856c53fa0424e3032f88b9fe2e04ee4b170266b82a7dcbfe29b1c2a15b78cd093df1204d15cfe378656cf050614a2cc8571a42407716b52d4b052fa583';

// Sample articles data
const articles = [
    {
        title: "PetStar Expands Recycling Capacity in Romania",
        slug: "petstar-expands-recycling-capacity-romania",
        excerpt: "PetStar announces a major expansion of its PET recycling facilities in Romania, increasing annual processing capacity by 30% to meet growing demand for sustainable packaging solutions.",
        content: [
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "PetStar, Romania's leading PET recycling company, today announced a significant expansion of its recycling facilities. This strategic investment will increase our annual processing capacity by 30%, enabling us to recycle an additional 15,000 tonnes of PET bottles per year." }
                ]
            },
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "The expansion includes state-of-the-art sorting technology and advanced washing systems that will improve the quality of our recycled PET (rPET) flakes and pellets. This positions PetStar as a key player in the circular economy, helping brands meet their sustainability targets." }
                ]
            },
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "\"This expansion reflects our commitment to building a sustainable future for Romania,\" said our CEO. \"By increasing our recycling capacity, we're not only reducing plastic waste but also creating jobs and supporting the local economy.\"" }
                ]
            }
        ],
        category: "Sustainability",
        language: "en",
        featured: true,
        publishedAt: new Date().toISOString(),
        imageUrls: [
            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
            "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80"
        ]
    },
    {
        title: "Circular Economy: How PET Bottle Recycling Works",
        slug: "circular-economy-pet-bottle-recycling-works",
        excerpt: "Discover the journey of a PET bottle from collection to transformation into new products. Learn how PetStar's advanced recycling process contributes to a circular economy.",
        content: [
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "The journey of a PET bottle through our recycling facility is a fascinating process that transforms waste into valuable resources. At PetStar, we process thousands of tonnes of PET bottles annually, converting them into high-quality recycled materials." }
                ]
            },
            {
                type: "heading",
                level: 2,
                children: [
                    { type: "text", text: "The Recycling Process" }
                ]
            },
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "Our recycling process begins with collection and sorting. Bottles are carefully separated by color and type, ensuring the highest quality output. Next, they undergo thorough washing to remove labels, caps, and contaminants." }
                ]
            },
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "The clean bottles are then ground into flakes, which are further processed into rPET pellets. These pellets can be used to manufacture new bottles, textiles, and other products, completing the circular economy loop." }
                ]
            }
        ],
        category: "Innovation",
        language: "en",
        featured: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrls: [
            "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80"
        ]
    },
    {
        title: "PetStar Partners with Major Brands for Sustainable Packaging",
        slug: "petstar-partners-major-brands-sustainable-packaging",
        excerpt: "Leading beverage and food brands choose PetStar's rPET solutions to meet their sustainability commitments and reduce environmental impact.",
        content: [
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "PetStar is proud to announce new partnerships with several major brands committed to sustainable packaging. These collaborations will see our high-quality recycled PET materials used in millions of bottles and containers across Europe." }
                ]
            },
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "Our rPET meets the highest food-grade standards and offers brands a sustainable alternative to virgin plastic. By choosing recycled materials, our partners are reducing their carbon footprint and supporting the circular economy." }
                ]
            },
            {
                type: "heading",
                level: 2,
                children: [
                    { type: "text", text: "Environmental Impact" }
                ]
            },
            {
                type: "paragraph",
                children: [
                    { type: "text", text: "Through these partnerships, we estimate that over 50,000 tonnes of CO2 emissions will be avoided annually compared to using virgin plastic. This is equivalent to taking 10,000 cars off the road for a year." }
                ]
            }
        ],
        category: "News",
        language: "en",
        featured: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrls: [
            "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=800&q=80",
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80"
        ]
    }
];

/**
 * Upload image from URL to Strapi
 */
async function uploadImageFromUrl(imageUrl, name) {
    try {
        console.log(`📥 Downloading image from ${imageUrl}...`);

        // Download image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to download image: ${imageResponse.status}`);
        }

        const imageBlob = await imageResponse.blob();

        // Create form data
        const formData = new FormData();
        formData.append('files', imageBlob, name);

        // Upload to Strapi
        const uploadResponse = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Failed to upload image: ${uploadResponse.status} - ${errorText}`);
        }

        const uploadData = await uploadResponse.json();
        console.log(`✅ Image uploaded successfully: ${uploadData[0].id}`);
        return uploadData[0];
    } catch (error) {
        console.error(`❌ Error uploading image:`, error.message);
        return null;
    }
}

/**
 * Create an article in Strapi
 */
async function createArticle(articleData) {
    try {
        console.log(`\n📝 Creating article: "${articleData.title}"...`);

        // Upload images first
        const uploadedImages = [];
        for (let i = 0; i < articleData.imageUrls.length; i++) {
            const imageUrl = articleData.imageUrls[i];
            const imageName = `${articleData.slug}-${i + 1}.jpg`;
            const uploadedImage = await uploadImageFromUrl(imageUrl, imageName);
            if (uploadedImage) {
                uploadedImages.push(uploadedImage.id);
            }
        }

        if (uploadedImages.length === 0) {
            console.warn(`⚠️  No images uploaded for article "${articleData.title}"`);
        }

        // Create article
        const articlePayload = {
            data: {
                title: articleData.title,
                slug: articleData.slug,
                excerpt: articleData.excerpt,
                content: articleData.content,
                category: articleData.category,
                language: articleData.language,
                featured: articleData.featured,
                publishedAt: articleData.publishedAt,
                images: uploadedImages
            }
        };

        const response = await fetch(`${API_URL}/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify(articlePayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create article: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Article created successfully! ID: ${result.data.id}`);
        return result.data;
    } catch (error) {
        console.error(`❌ Error creating article:`, error.message);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Starting sample article creation...\n');
    console.log(`API Endpoint: ${API_URL}`);
    console.log(`Creating ${articles.length} articles...\n`);

    const results = [];
    for (const article of articles) {
        const result = await createArticle(article);
        results.push(result);

        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n📊 Summary:');
    console.log(`Total articles: ${articles.length}`);
    console.log(`Successfully created: ${results.filter(r => r !== null).length}`);
    console.log(`Failed: ${results.filter(r => r === null).length}`);

    console.log('\n✨ Done! Check your articles at: https://api.petstar-dash.ro/admin/content-manager/collection-types/api::article.article');
}

// Run the script
main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
