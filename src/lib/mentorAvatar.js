// Deterministic, professional-looking illustrated avatars for mentors —
// used in place of raw stock photoUrls, which read as random/inconsistent
// stock photography rather than "our mentor". Same seed always renders the
// same face, so a given mentor looks consistent everywhere they appear.
// Clothing is restricted to blazer/collared options so every mentor reads
// as dressed for a professional mock interview, not casual streetwear.
const PROFESSIONAL_CLOTHING = ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater'].join(',')

export function getMentorAvatarUrl(seed, { format = 'svg' } = {}) {
  const s = encodeURIComponent(seed || 'mentor')
  return `https://api.dicebear.com/9.x/avataaars/${format}?seed=${s}&clothing=${PROFESSIONAL_CLOTHING}&accessoriesProbability=15&facialHairProbability=35&backgroundColor=ffedd5,fff7ed,ffe4cc`
}
