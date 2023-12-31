import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

import * as S from './styles';
interface MainTemplateProps {
  children: React.ReactNode;
}

function MainTemplate({ children }: MainTemplateProps) {
  return (
    <>
      <Header />
      <S.TemplateContainer>
        <S.TemplateInner>{children}</S.TemplateInner>
      </S.TemplateContainer>
      <Footer />
    </>
  );
}

export default MainTemplate;
