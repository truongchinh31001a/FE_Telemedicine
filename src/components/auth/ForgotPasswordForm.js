'use client';

import { useForm } from 'react-hook-form';
import { Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordForm({ onBack }) {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[350px] h-[270px] space-y-6 bg-white p-6 rounded-lg animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {t('forgot_password')}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {t('email')}
          </label>
          <Input
            placeholder={t('email')}
            {...register('email', { required: true })}
            className="py-2"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button type="primary" htmlType="submit" block size="large">
          {t('send_reset_link')}
        </Button>

        <Button
          type="link"
          onClick={onBack}
          block
          className="text-blue-500"
        >
          ← {t('back_to_login')}
        </Button>
      </div>
    </form>
  );
}
