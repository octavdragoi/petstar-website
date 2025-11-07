#!/bin/bash

# PetStar Sample Articles Creation Script
API_URL="https://api.petstar-dash.ro/api"
TOKEN="ca6086b9ec38b156a1a00d407c52593fb7ed2483a01d0c2a0428197574d092b3dfc37ced947681c4616fb9cbf2180601dddc49e20030069c342eecb9a63f6bba66b140856c53fa0424e3032f88b9fe2e04ee4b170266b82a7dcbfe29b1c2a15b78cd093df1204d15cfe378656cf050614a2cc8571a42407716b52d4b052fa583"

echo "🚀 Creating sample articles for PetStar..."

# Article 1
echo ""
echo "📝 Creating Article 1: PetStar Expands Recycling Capacity..."
curl -X POST "$API_URL/articles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "PetStar Expands Recycling Capacity in Romania",
      "slug": "petstar-expands-recycling-capacity-romania",
      "excerpt": "PetStar announces a major expansion of its PET recycling facilities in Romania, increasing annual processing capacity by 30% to meet growing demand for sustainable packaging solutions.",
      "content": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "PetStar, Romania'\''s leading PET recycling company, today announced a significant expansion of its recycling facilities. This strategic investment will increase our annual processing capacity by 30%, enabling us to recycle an additional 15,000 tonnes of PET bottles per year."
            }
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "The expansion includes state-of-the-art sorting technology and advanced washing systems that will improve the quality of our recycled PET (rPET) flakes and pellets. This positions PetStar as a key player in the circular economy, helping brands meet their sustainability targets."
            }
          ]
        }
      ],
      "category": "Sustainability",
      "language": "en",
      "featured": true,
      "publishedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
    }
  }'

echo ""
echo "✅ Article 1 created!"

# Article 2
echo ""
echo "📝 Creating Article 2: Circular Economy..."
curl -X POST "$API_URL/articles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Circular Economy: How PET Bottle Recycling Works",
      "slug": "circular-economy-pet-bottle-recycling-works",
      "excerpt": "Discover the journey of a PET bottle from collection to transformation into new products. Learn how PetStar'\''s advanced recycling process contributes to a circular economy.",
      "content": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "The journey of a PET bottle through our recycling facility is a fascinating process that transforms waste into valuable resources. At PetStar, we process thousands of tonnes of PET bottles annually, converting them into high-quality recycled materials."
            }
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "children": [
            {
              "type": "text",
              "text": "The Recycling Process"
            }
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Our recycling process begins with collection and sorting. Bottles are carefully separated by color and type, ensuring the highest quality output. Next, they undergo thorough washing to remove labels, caps, and contaminants. The clean bottles are then ground into flakes, which are further processed into rPET pellets."
            }
          ]
        }
      ],
      "category": "Innovation",
      "language": "en",
      "featured": false,
      "publishedAt": "'$(date -u -d '2 days ago' +%Y-%m-%dT%H:%M:%S.000Z)'"
    }
  }'

echo ""
echo "✅ Article 2 created!"

# Article 3
echo ""
echo "📝 Creating Article 3: PetStar Partners with Major Brands..."
curl -X POST "$API_URL/articles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "PetStar Partners with Major Brands for Sustainable Packaging",
      "slug": "petstar-partners-major-brands-sustainable-packaging",
      "excerpt": "Leading beverage and food brands choose PetStar'\''s rPET solutions to meet their sustainability commitments and reduce environmental impact.",
      "content": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "PetStar is proud to announce new partnerships with several major brands committed to sustainable packaging. These collaborations will see our high-quality recycled PET materials used in millions of bottles and containers across Europe."
            }
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Our rPET meets the highest food-grade standards and offers brands a sustainable alternative to virgin plastic. By choosing recycled materials, our partners are reducing their carbon footprint and supporting the circular economy."
            }
          ]
        }
      ],
      "category": "News",
      "language": "en",
      "featured": true,
      "publishedAt": "'$(date -u -d '5 days ago' +%Y-%m-%dT%H:%M:%S.000Z)'"
    }
  }'

echo ""
echo "✅ Article 3 created!"

echo ""
echo "✨ Done! All 3 articles have been created."
echo "📍 View them at: https://api.petstar-dash.ro/admin/content-manager/collection-types/api::article.article"
