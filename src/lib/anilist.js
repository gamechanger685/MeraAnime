export const fetchBanner = async (title) => {
  const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        bannerImage
        coverImage { extraLarge }
      }
    }
  `;
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { search: title } }),
    });
    const { data } = await response.json();
    return data.Media?.bannerImage || data.Media?.coverImage?.extraLarge;
  } catch (error) {
    return null;
  }
};