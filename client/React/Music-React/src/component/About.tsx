import { Box, Typography, Button, Grid, Card, CardContent, Avatar } from '@mui/material';

const About = () => {
  return (
    <Box sx={{ backgroundColor: '#121212', color: '#E0E0E0', padding: '80px 20px' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', marginBottom: '60px' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '48px', color: '#FF8C00' }}>
          אודות הפלטפורמה
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', fontSize: '22px', marginTop: '20px' }}>
          יצירה, שיתוף, וקהילה מוזיקלית עולמית
        </Typography>
      </Box>

      {/* About Content */}
      <Box sx={{ marginBottom: '60px' }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)', position: 'relative' }}>
              <Avatar
                src="/images/music-hero.jpg" // ניתן לשים תמונה של הפלטפורמה
                sx={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }}
              />
              <CardContent sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ color: '#FF8C00', fontWeight: 'bold' }}>
                  הקהילה שלנו
                </Typography>
                <Typography variant="body1" sx={{ color: '#E0E0E0', marginTop: '10px' }}>
                  אנו מציעים פלטפורמה שמחברת בין יוצרים, מאזינים, ומבקרים. שתפו את המוזיקה שלכם, קבלו משוב, והכירו יוצרים אחרים מכל העולם.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)', position: 'relative' }}>
              <Avatar
                src="/images/community.jpg" // תמונה של קהילה
                sx={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }}
              />
              <CardContent sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ color: '#FF8C00', fontWeight: 'bold' }}>
                  הקשבה ושיתוף
                </Typography>
                <Typography variant="body1" sx={{ color: '#E0E0E0', marginTop: '10px' }}>
                  פלטפורמתנו מציעה שיתוף אמיתי של יצירות מוזיקליות מכל הסוגים, ויצירת חיבורים בינלאומיים עם יוצרים ומאזינים.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)', position: 'relative' }}>
              <Avatar
                src="/images/engage.jpg" // תמונה של אנשים מגיבים
                sx={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }}
              />
              <CardContent sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ color: '#FF8C00', fontWeight: 'bold' }}>
                  תגובות ומעורבות
                </Typography>
                <Typography variant="body1" sx={{ color: '#E0E0E0', marginTop: '10px' }}>
                  תקבלו משוב ישיר מהקהילה שלנו ותחוו חוויות חדשות בתגובה למוזיקה שלכם.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
        <Typography variant="h4" sx={{ color: '#FF8C00', fontWeight: 'bold', marginBottom: '20px' }}>
          הצטרף לפלטפורמת המוזיקה שלנו
        </Typography>
        <Typography variant="h6" sx={{ color: '#E0E0E0', marginBottom: '40px' }}>
          שתף את המוזיקה שלך עם העולם, קבל תגובות ושפר את היצירות שלך.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF8C00',
            padding: '12px 30px',
            borderRadius: '30px',
            fontSize: '18px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#FF5722',
            },
          }}
        >
          הצטרף עכשיו
        </Button>
      </Box>
    </Box>
  );
};

export default About;
