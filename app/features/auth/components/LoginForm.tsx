import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { Input } from './Input';
import { Button } from './Button';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { login, isLoading } = useAuthStore();
  const GOLD_COLOR = "#D4AF37";
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <label style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          fontSize: "0.8rem",
          color: "rgba(224,224,224,0.5)"
        }}>
          <input
            type="checkbox"
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "4px",
              backgroundColor: "#1e2028",
              border: `1px solid rgba(212, 175, 55, 0.3)`,
              accentColor: GOLD_COLOR,
              cursor: "pointer"
            }}
            {...register('rememberMe')}
          />
          Запомнить
        </label>
        
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: GOLD_COLOR,
            cursor: "pointer",
            fontSize: "0.8rem",
            padding: 0,
            fontFamily: "'JetBrains Mono', monospace"
          }}
          className="hover:opacity-80"
        >
          Забыли пароль?
        </button>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Войти
      </Button>

      <p style={{
        textAlign: "center",
        fontSize: "0.8rem",
        color: "rgba(224,224,224,0.4)",
        margin: 0
      }}>
        Нет аккаунта?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: GOLD_COLOR,
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: 600,
            padding: 0,
            fontFamily: "'JetBrains Mono', monospace"
          }}
          className="hover:opacity-80"
        >
          Создать
        </button>
      </p>
    </form>
  );
};
