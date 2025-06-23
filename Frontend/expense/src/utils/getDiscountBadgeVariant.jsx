const getDiscountBadgeVariant = (discountType) => {
    return discountType === 'PERCENTAGE' ? 'secondary' : 'outline'
  }

  export default getDiscountBadgeVariant;