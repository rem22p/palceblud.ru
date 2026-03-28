import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../../settings/store/settingsStore';
import { Input } from './Input';
import { Button } from './Button';

const registerSchema = z.object({
  username: z.string().min(3, 'Минимум 3 символа'),
  email: z.string().email('Некорректный email'),
  password: z.string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Хотя бы одна заглавная буква')
    .regex(/[0-9]/, 'Хотя бы одна цифра'),
  verifyPassword: z.string(),
}).refine(data => data.password === data.verifyPassword, {
  message: 'Пароли не совпадают',
  path: ['verifyPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { register: registerUser, isLoading } = useAuthStore();
  const accentColor = useSettingsStore((state) => state.accentColor);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Input
        label="Имя пользователя"
        type="text"
        placeholder="username"
        error={errors.username?.message}
        {...register('username')}
      />
      
      <Input
        label="Email"
        type="email"
        placeholder="example@mail.ru"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Подтвердите пароль"
        type="password"
        placeholder="••••••••"
        error={errors.verifyPassword?.message}
        {...register('verifyPassword')}
      />

      <Button type="submit" isLoading={isLoading}>
        Зарегистрироваться
      </Button>

      <p style={{
        textAlign: "center",
        fontSize: "0.8rem",
        color: "rgba(224,224,224,0.4)",
        margin: 0
      }}>
        Уже есть аккаунт?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: accentColor,
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: 600,
            padding: 0,
            fontFamily: "'JetBrains Mono', monospace"
          }}
          className="hover:opacity-80"
        >
          Войти
        </button>
      </p>
    </form>
  );
};
