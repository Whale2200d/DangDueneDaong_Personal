import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';

// api
import { addPost, uploadImage } from '../../apis/good';

// components
import MainTemplate from '../../components/template/MainTemplate';

import * as S from './styles';
import Input from '../../components/Form/Input';
import Button from '../../components/Button';
import Textarea from '../../components/Form/Textarea';
import Dropdown from '../../components/Dropdown';
import MultiUploader from '../../components/FileUploader/MultiUploader';

export interface UplodePageCSSProps {
  inputContainerDirection?: 'row' | 'column';
}

function UplodePage() {
  const navigate = useNavigate();

  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setFocus,
    setError,
    watch,
  } = useForm({ mode: 'onBlur' });

  // 디버깅용 코드
  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log('태그', tags);
  }, [tags]);

  useEffect(() => {
    console.log('선택된 파일', selectedFiles);
  }, [selectedFiles]);

  useEffect(() => {
    setValue('title', '제목');
    setValue('description', '내용');
  }, []);

  // 엔터 입력 시 포커스가 다른 폼으로 넘어가지 않도록 방지
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // 폼 전송 취소
  const onClickCancel = () => {
    // TODO : confirm() 부분 Confirm Modal으로 변경
    if (window.confirm('게시글 작성을 취소하시겠습니까?')) {
      navigate('/');
    }
  };

  // 폼 전송
  const { mutateAsync: uploadImagesMutation } = useMutation(uploadImage);
  const { mutate: addPostMutation } = useMutation(addPost, {
    // TODO : alert() 부분 Alert Modal으로 변경
    onSuccess: () => {
      alert('게시글이 등록되었습니다.');
      navigate('/');
    },
    onError: (error) => {
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
      console.log(error);
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // NOTE : 이미지 업로드 순서 보장을 위해 mutateAsync 사용
      // muatate는 반환값이 없지만, mutateAsync는 return 값을 Promise로 반환
      const uploadedImages = await uploadImagesMutation(selectedFiles);

      const postData = {
        // user_id : userID 로그인 시 recoil state에서 가져오기
        main_category: selectedCategory,
        sub_category: selectedProduct,
        title: data.title,
        description: data.description,
        status: '판매중',
        good_image_list: uploadedImages,
      };

      addPostMutation(postData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainTemplate>
      <S.Container>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
          <S.Inner>
            {/* 이미지 등록 컨테이너 */}
            <div style={{ marginBottom: '20px' }}>
              <MultiUploader
                onSelectItem={(files) => setSelectedFiles(files)}
              />
            </div>

            {/* 카테고리 선택 */}
            <S.InputContainer inputContainerDirection="row">
              <S.Title>카테고리</S.Title>
              <S.DropdownContainer>
                <Dropdown
                  listData={['강아지', '고양이']}
                  selectedItem={selectedCategory}
                  onSelectItem={(item) => setSelectedCategory(item)}
                ></Dropdown>
              </S.DropdownContainer>

              <S.DropdownContainer>
                <Dropdown
                  listData={['사료', '간식', '용품']}
                  selectedItem={selectedProduct}
                  onSelectItem={(item) => setSelectedProduct(item)}
                ></Dropdown>
              </S.DropdownContainer>
            </S.InputContainer>

            {/* 제목 입력 */}
            <S.InputContainer>
              <Input
                type="text"
                label="제목 *"
                containerType="content"
                errors={errors}
                style={{ borderRadius: '4px', margin: '0', maxWidth: '656px' }}
                {...register('title', {
                  required: '제목을 입력해주세요',
                })}
              />
            </S.InputContainer>

            {/* 내용 입력 */}
            <S.InputContainer>
              <Textarea
                label="제품정보 *"
                containerType="content"
                errors={errors}
                style={{ borderRadius: '4px', margin: '0' }}
                {...register('description', {
                  required: '내용을 입력해주세요',
                })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setValue('description', `${watch('description')}\n`);
                  }
                }}
              ></Textarea>
            </S.InputContainer>

            <S.ButtonContainer>
              <Button
                type="button"
                styleType="warning"
                width="128px"
                borderRadius="20px"
                onClickHandler={onClickCancel}
              >
                취소
              </Button>

              <Button width="128px" borderRadius="20px">
                완료
              </Button>
            </S.ButtonContainer>
          </S.Inner>
        </form>
      </S.Container>
    </MainTemplate>
  );
}

export default UplodePage;
