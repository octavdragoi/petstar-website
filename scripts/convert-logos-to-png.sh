#!/bin/bash

##############################################################################
# Logo Conversion Script
# Converts JPG partner logos to PNG with transparent backgrounds
# Uses ImageMagick for automated background removal
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
SOURCE_DIR="/home/octavdragoi/code/petstar-website/assets/images/clients"
OUTPUT_DIR="${SOURCE_DIR}/png"

echo -e "${GREEN}=== Partner Logo Conversion Script ===${NC}"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Please install it with: sudo dnf install ImageMagick"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# List of logos to convert
LOGOS=(
    "pepsi"
    "expur"
    "zizin"
    "perla"
    "tusnad"
    "bunge"
    "albalact"
    "covalact"
    "spring"
)

echo "Converting ${#LOGOS[@]} logos from JPG to PNG with transparent backgrounds..."
echo ""

# Convert each logo
for logo in "${LOGOS[@]}"; do
    input_file="${SOURCE_DIR}/${logo}.jpg"
    output_file="${OUTPUT_DIR}/${logo}.png"

    if [ ! -f "$input_file" ]; then
        echo -e "${YELLOW}⚠️  Skipping ${logo}: source file not found${NC}"
        continue
    fi

    echo -e "Processing ${logo}..."

    # Convert JPG to PNG with background removal
    # This uses ImageMagick's fuzz factor to remove similar colors to the background
    # Adjust -fuzz percentage (0-100%) to control how aggressive the removal is
    convert "$input_file" \
        -fuzz 15% \
        -transparent white \
        -trim \
        +repage \
        "$output_file"

    if [ $? -eq 0 ]; then
        # Get file sizes for comparison
        input_size=$(du -h "$input_file" | cut -f1)
        output_size=$(du -h "$output_file" | cut -f1)
        echo -e "${GREEN}✓ ${logo}.png created (${input_size} → ${output_size})${NC}"
    else
        echo -e "${RED}✗ Failed to convert ${logo}${NC}"
    fi
done

echo ""
echo -e "${GREEN}=== Conversion Complete ===${NC}"
echo ""
echo "Original JPGs: ${SOURCE_DIR}/"
echo "Converted PNGs: ${OUTPUT_DIR}/"
echo ""
echo "Next steps:"
echo "1. Review the PNG files in ${OUTPUT_DIR}/"
echo "2. If backgrounds aren't fully transparent, adjust the -fuzz value in this script"
echo "3. Update section-07-portfolio.html to use .png instead of .jpg"
echo "4. Optional: manually clean up any remaining artifacts in GIMP/Photoshop"
