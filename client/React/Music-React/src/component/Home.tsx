import { Box, Typography, Button, } from '@mui/material';
import { Link } from 'react-router-dom';
import NewSongs from './NewSongs';

const Home = () => {

  return (
    <Box sx={{ color: '#E0E0E0', minHeight: '80vh' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'url("/images/header-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          color: '#FFF',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '48px', marginTop: '70px' }}>
          הדור הבא של המוזיקה החברתית מתחיל כאן.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', fontSize: '22px', marginTop: '20px' }}>
          פלטפורמה שמחברת בין יצירה, קהילה, וטכנולוגיה – בוא להיות חלק מהמהפכה.
        </Typography>
        <Box sx={{ marginTop: '40px' }}>
          <Button
            component={Link}
            to="musicLibrary/songList"
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #c67c28, #e3aa50)',
              padding: '10px 30px',
              borderRadius: '30px',
              fontSize: '18px',
              textTransform: 'none',
              boxShadow: '0px 0px 20px rgb(0, 0, 0)',
              '&:hover': {
                boxShadow: '0px 0px 20px rgb(0, 0, 0)',
              },
            }}
          >
            למוזיקה
          </Button>
        </Box>
      </Box>

      <NewSongs />

      {/* About Section */}
      <Box
        sx={{
          padding: '60px 20px',
          backgroundColor: '#222',
          textAlign: 'center',
          marginTop: '40px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h4" sx={{ color: '#e3aa50', fontWeight: 'bold', marginBottom: '20px' }}>
          אודות האתר
        </Typography>
        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 'normal', maxWidth: '800px', margin: '0 auto' }}>
          הפלטפורמה החברתית שלנו נועדה לחובבי מוזיקה, יוצרים ומאזינים. כאן תוכלו לפרסם שירים, להגיב, לקבל פידבק אמיתי, ולבנות קהילה סביב המוזיקה שאתם אוהבים. המקום שלכם ליצירה, שיתוף, והשראה.
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#1A1A1A' }}>
        <Typography variant="body2" sx={{ color: '#E0E0E0', fontSize: '14px' }}>
          © 2025 פלטפורמת המוזיקה החברתית. כל הזכויות שמורות.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;