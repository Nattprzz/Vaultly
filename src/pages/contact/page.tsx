import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/feature/SeoHead';
import { useTheme } from '@/hooks/useTheme';

const FAQ_CATEGORIES = [
  {
    id: 'cuenta',
    label: 'Cuenta',
    icon: 'ri-user-line',
    items: [
      {
        q: '¿Cómo cambio mi contraseña?',
        a: 'Ve a la página de inicio de sesión y haz clic en "¿Olvidaste tu contraseña?". Te enviaremos un enlace de recuperación a tu correo. También puedes cambiarlo desde Ajustes → Cuenta si ya estás dentro.',
        link: { text: 'Recuperar contraseña', to: '/auth' },
      },
      {
        q: '¿Puedo cambiar mi nombre de usuario?',
        a: 'Sí, puedes modificarlo en cualquier momento desde Ajustes → Cuenta. Ten en cuenta que si tienes un perfil público compartido, la URL cambiará y los enlaces anteriores dejarán de funcionar.',
        link: { text: 'Ir a Ajustes', to: '/settings' },
      },
      {
        q: '¿Cómo elimino mi cuenta?',
        a: 'Puedes eliminar tu cuenta permanentemente desde Ajustes → Cuenta → Eliminar cuenta. Esta acción es irreversible: se borrarán todos tus datos, tracker, reseñas y perfil. Si tienes dudas, contáctanos antes.',
        link: null,
      },
      {
        q: '¿Puedo tener varias cuentas?',
        a: 'No, los Términos de Uso de Vaultly permiten una única cuenta por persona. Si necesitas acceso para un equipo o uso profesional, escríbenos a hola@vaultly.app.',
        link: null,
      },
    ],
  },
  {
    id: 'tracker',
    label: 'Tracker',
    icon: 'ri-bookmark-line',
    items: [
      {
        q: '¿Cuántos ítems puedo añadir al tracker?',
        a: 'En el plan gratuito no hay límite de ítems. Puedes trackear tantas películas, series, libros, videojuegos y demás como quieras.',
        link: null,
      },
      {
        q: '¿Puedo importar mi historial desde otras plataformas?',
        a: 'Actualmente no tenemos importación automática desde plataformas externas (Letterboxd, Goodreads, MAL...), pero es una funcionalidad que tenemos en el roadmap. Si quieres que la prioricemos, ¡mándanos una sugerencia!',
        link: { text: 'Enviar sugerencia', to: '/contact' },
      },
      {
        q: '¿Cómo exporto mis datos del tracker?',
        a: 'Puedes exportar todo tu tracker en formato CSV o JSON desde Ajustes → Cuenta → Exportar datos. El archivo incluye todos tus ítems, estados, puntuaciones y fechas.',
        link: { text: 'Ir a Ajustes', to: '/settings' },
      },
      {
        q: '¿El tracker funciona sin conexión?',
        a: 'Actualmente Vaultly requiere conexión a internet para sincronizar tu tracker. Estamos trabajando en un modo offline para una versión futura.',
        link: null,
      },
    ],
  },
  {
    id: 'privacidad',
    label: 'Privacidad',
    icon: 'ri-shield-check-line',
    items: [
      {
        q: '¿Quién puede ver mi perfil?',
        a: 'Por defecto tu perfil es público, pero puedes hacerlo privado en cualquier momento desde Ajustes → Privacidad. Con el perfil privado, solo tú puedes ver tu tracker y estadísticas.',
        link: { text: 'Ajustes de privacidad', to: '/settings' },
      },
      {
        q: '¿Vendéis mis datos a terceros?',
        a: 'No. Nunca vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales. Puedes leer todos los detalles en nuestra Política de Privacidad.',
        link: { text: 'Política de Privacidad', to: '/privacy' },
      },
      {
        q: '¿Cómo solicito la eliminación de mis datos?',
        a: 'Puedes eliminar tu cuenta y todos los datos asociados desde Ajustes → Cuenta. Si necesitas una eliminación específica de ciertos datos o tienes una solicitud RGPD, escríbenos a privacy@vaultly.app.',
        link: null,
      },
    ],
  },
  {
    id: 'tecnico',
    label: 'Técnico',
    icon: 'ri-tools-line',
    items: [
      {
        q: '¿En qué navegadores funciona Vaultly?',
        a: 'Vaultly funciona en las versiones modernas de Chrome, Firefox, Safari y Edge. Recomendamos mantener el navegador actualizado para la mejor experiencia.',
        link: null,
      },
      {
        q: 'La página no carga correctamente, ¿qué hago?',
        a: 'Prueba a limpiar la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R en Mac) y recarga la página. Si el problema persiste, repórtalo usando el formulario de contacto indicando tu navegador y sistema operativo.',
        link: { text: 'Reportar un bug', to: '/contact' },
      },
      {
        q: '¿Tenéis app móvil?',
        a: 'Actualmente Vaultly es una aplicación web optimizada para móvil. Estamos desarrollando apps nativas para iOS y Android. Síguenos en redes para enterarte cuando estén disponibles.',
        link: null,
      },
      {
        q: '¿Tenéis API pública?',
        a: 'Todavía no tenemos una API pública documentada, pero es algo que tenemos en mente para el futuro. Si eres desarrollador y tienes un caso de uso concreto, escríbenos.',
        link: { text: 'Contactar', to: '/contact' },
      },
    ],
  },
];

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const TOPICS = [
  { value: 'soporte-tecnico', label: 'Soporte técnico', icon: 'ri-tools-line' },
  { value: 'reporte-bug', label: 'Reportar un bug', icon: 'ri-bug-line' },
  { value: 'sugerencia', label: 'Sugerencia o mejora', icon: 'ri-lightbulb-line' },
  { value: 'cuenta', label: 'Problema con mi cuenta', icon: 'ri-user-settings-line' },
  { value: 'privacidad', label: 'Privacidad y datos', icon: 'ri-shield-check-line' },
  { value: 'otro', label: 'Otro', icon: 'ri-chat-3-line' },
];

const CONTACT_CARDS = [
  {
    icon: 'ri-mail-line',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    title: 'Email general',
    desc: 'Para consultas generales y soporte',
    value: 'hola@vaultly.app',
    href: 'mailto:hola@vaultly.app',
  },
  {
    icon: 'ri-shield-check-line',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    title: 'Privacidad y datos',
    desc: 'Solicitudes RGPD y datos personales',
    value: 'privacy@vaultly.app',
    href: 'mailto:privacy@vaultly.app',
  },
  {
    icon: 'ri-scales-3-line',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'Legal',
    desc: 'Consultas legales y términos',
    value: 'legal@vaultly.app',
    href: 'mailto:legal@vaultly.app',
  },
];

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();
  const formRef = useRef<HTMLFormElement>(null);

  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [touched, setTouched] = useState({ topic: false, name: false, email: false, message: false });
  const [faqCategory, setFaqCategory] = useState('cuenta');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const touch = (field: keyof typeof touched) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const errors = {
    topic: !topic ? 'Selecciona un motivo de contacto.' : '',
    name: !name.trim() ? 'El nombre es obligatorio.' : '',
    email: !email ? 'El correo electrónico es obligatorio.' : !emailValid ? 'Introduce un correo válido.' : '',
    message: !message.trim() ? 'El mensaje es obligatorio.' : message.length > 500 ? 'Máximo 500 caracteres.' : '',
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const charsLeft = 500 - message.length;

  const inputBase = 'w-full py-3 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors';
  const inputNormal = 'border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500';
  const inputErr = 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10 focus:border-rose-400';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ topic: true, name: true, email: true, message: true });
    if (hasErrors) return;

    setSubmitStatus('sending');
    try {
      const body = new URLSearchParams({
        topic,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      const res = await fetch('https://readdy.ai/api/form/d7f10maa509fjl5l01jg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setTopic('');
        setName('');
        setEmail('');
        setMessage('');
        setTouched({ topic: false, name: false, email: false, message: false });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <SeoHead
        title="Contacto — Vaultly"
        description="¿Tienes alguna pregunta, sugerencia o problema? Contacta con el equipo de Vaultly. Respondemos en menos de 48 horas."
        keywords="contacto, soporte, ayuda, Vaultly"
        canonical="/contact"
      />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
              <i className="ri-archive-2-line text-white text-sm"></i>
            </div>
            <span className="font-bold text-zinc-900 dark:text-white text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Vaultly
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
            </button>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-100 dark:border-zinc-800 py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 mb-6">
            <i className="ri-customer-service-2-line text-rose-500 text-sm"></i>
            <span className="text-rose-600 dark:text-rose-400 text-xs font-medium">Estamos aquí para ayudarte</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Contacta con nosotros
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            ¿Tienes una pregunta, encontraste un bug o quieres compartir una idea? Escríbenos y te respondemos en menos de 48 horas.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="border-b border-zinc-100 dark:border-zinc-800 py-10 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACT_CARDS.map(card => (
            <a
              key={card.title}
              href={card.href}
              className="flex items-start gap-4 bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                <i className={`${card.icon} ${card.color} text-base`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">{card.title}</p>
                <p className="text-xs text-zinc-400 mb-1.5 leading-snug">{card.desc}</p>
                <p className="text-xs font-medium text-violet-500 group-hover:text-violet-600 transition-colors truncate">{card.value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Main content: form + sidebar */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16">

        {/* Sidebar info */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
          {/* Response time */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Tiempos de respuesta</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Soporte técnico', time: '&lt; 24h', color: 'text-emerald-500' },
                { label: 'Bugs críticos', time: '&lt; 4h', color: 'text-rose-500' },
                { label: 'Sugerencias', time: '&lt; 72h', color: 'text-amber-500' },
                { label: 'Consultas legales', time: '&lt; 30 días', color: 'text-zinc-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
                  <span className={`text-xs font-semibold ${item.color}`} dangerouslySetInnerHTML={{ __html: item.time }} />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ links */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Antes de escribirnos</p>
            <div className="flex flex-col gap-2">
              {[
                { icon: 'ri-question-line', text: '¿Cómo exporto mis datos?', href: '/settings' },
                { icon: 'ri-lock-password-line', text: '¿Olvidé mi contraseña?', href: '/auth' },
                { icon: 'ri-user-settings-line', text: 'Cambiar ajustes de privacidad', href: '/settings' },
                { icon: 'ri-shield-check-line', text: 'Política de Privacidad', href: '/privacy' },
                { icon: 'ri-file-list-3-line', text: 'Términos de Uso', href: '/terms' },
              ].map(item => (
                <Link
                  key={item.text}
                  to={item.href}
                  className="flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-1 group"
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-sm text-zinc-400 group-hover:text-violet-500 transition-colors`}></i>
                  </div>
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Síguenos</p>
            <div className="flex gap-3">
              {[
                { icon: 'ri-twitter-x-line', label: 'Twitter / X' },
                { icon: 'ri-instagram-line', label: 'Instagram' },
                { icon: 'ri-discord-line', label: 'Discord' },
              ].map(s => (
                <a
                  key={s.label}
                  href="#"
                  rel="nofollow noopener"
                  title={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <i className={`${s.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <main className="flex-1 min-w-0">
          {submitStatus === 'success' ? (
            <div className="flex flex-col items-center gap-6 py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-4xl text-emerald-500"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ¡Mensaje enviado!
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Hemos recibido tu mensaje. Te responderemos en el correo{' '}
                  <strong className="text-zinc-700 dark:text-zinc-300">{email || 'indicado'}</strong>{' '}
                  lo antes posible.
                </p>
              </div>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              id="contact-form"
              data-readdy-form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Envíanos un mensaje
                </h2>
                <p className="text-sm text-zinc-500">Rellena el formulario y te responderemos en breve.</p>
              </div>

              {/* Topic selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Motivo de contacto <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPICS.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => { setTopic(t.value); touch('topic'); }}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${
                        topic === t.value
                          ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
                          : touched.topic && !topic
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/10 text-zinc-600 dark:text-zinc-400'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <i className={`${t.icon} text-sm`}></i>
                      </div>
                      <span className="truncate">{t.label}</span>
                      {topic === t.value && (
                        <div className="ml-auto w-4 h-4 flex items-center justify-center flex-shrink-0">
                          <i className="ri-check-line text-xs text-violet-500"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {touched.topic && errors.topic && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-500">
                    <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                    {errors.topic}
                  </p>
                )}
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center ${touched.name && errors.name ? 'text-rose-400' : 'text-zinc-400'}`}>
                      <i className="ri-user-line text-sm"></i>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={e => { setName(e.target.value); touch('name'); }}
                      onBlur={() => touch('name')}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      className={`${inputBase} pl-10 ${touched.name && errors.name ? inputErr : inputNormal}`}
                    />
                    {touched.name && !errors.name && name && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                        <i className="ri-check-line text-sm"></i>
                      </div>
                    )}
                  </div>
                  {touched.name && errors.name && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-500">
                      <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Correo electrónico <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center ${touched.email && errors.email ? 'text-rose-400' : 'text-zinc-400'}`}>
                      <i className="ri-mail-line text-sm"></i>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); touch('email'); }}
                      onBlur={() => touch('email')}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      className={`${inputBase} pl-10 ${touched.email && errors.email ? inputErr : inputNormal}`}
                    />
                    {touched.email && !errors.email && email && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                        <i className="ri-check-line text-sm"></i>
                      </div>
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-500">
                      <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Mensaje <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-xs ${charsLeft < 50 ? charsLeft < 0 ? 'text-rose-500' : 'text-amber-500' : 'text-zinc-400'}`}>
                    {charsLeft} caracteres restantes
                  </span>
                </div>
                <textarea
                  name="message"
                  value={message}
                  onChange={e => { setMessage(e.target.value); touch('message'); }}
                  onBlur={() => touch('message')}
                  placeholder="Describe tu consulta con el mayor detalle posible. Si es un bug, incluye los pasos para reproducirlo."
                  rows={6}
                  maxLength={500}
                  className={`${inputBase} resize-none leading-relaxed ${touched.message && errors.message ? inputErr : inputNormal}`}
                />
                {touched.message && errors.message && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-500">
                    <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Error banner */}
              {submitStatus === 'error' && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                  <i className="ri-error-warning-line text-rose-500 flex-shrink-0"></i>
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    Hubo un error al enviar el mensaje. Inténtalo de nuevo o escríbenos directamente a{' '}
                    <a href="mailto:hola@vaultly.app" className="font-semibold underline">hola@vaultly.app</a>.
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="submit"
                  disabled={submitStatus === 'sending'}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'sending' ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line"></i>
                      Enviar mensaje
                    </>
                  )}
                </button>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Al enviar aceptas nuestra{' '}
                  <Link to="/privacy" className="text-violet-500 hover:text-violet-600 transition-colors">
                    Política de Privacidad
                  </Link>.
                </p>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-zinc-100 dark:border-zinc-800 py-14 md:py-20 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 mb-4">
                <i className="ri-question-answer-line text-violet-500 text-sm"></i>
                <span className="text-violet-600 dark:text-violet-400 text-xs font-medium">Preguntas frecuentes</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Respuestas rápidas
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                Puede que tu duda ya esté resuelta aquí. Si no, usa el formulario de arriba.
              </p>
            </div>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setFaqCategory(cat.id); setOpenFaq(null); }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    faqCategory === cat.id
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <i className={`${cat.icon} text-sm`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion */}
          <div className="max-w-3xl">
            {FAQ_CATEGORIES.find(c => c.id === faqCategory)?.items.map((item, idx) => {
              const key = `${faqCategory}-${idx}`;
              const isOpen = openFaq === key;
              return (
                <div
                  key={key}
                  className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
                  >
                    <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                      {item.q}
                    </span>
                    <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg transition-all ${isOpen ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-500 rotate-45' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'}`}>
                      <i className="ri-add-line text-sm"></i>
                    </div>
                  </button>

                  {/* Answer — animated with max-height trick */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="pb-5 pr-11">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                        {item.a}
                      </p>
                      {item.link && (
                        <Link
                          to={item.link.to}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-500 hover:text-violet-600 transition-colors"
                        >
                          <i className="ri-arrow-right-line text-xs"></i>
                          {item.link.text}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Still need help CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-3xl">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center flex-shrink-0">
              <i className="ri-customer-service-2-line text-rose-500 text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">¿No encontraste lo que buscabas?</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Usa el formulario de arriba y te respondemos en menos de 48 horas.</p>
            </div>
            <a
              href="#contact-form"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <i className="ri-send-plane-line"></i>
              Escribirnos
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-8 px-4 md:px-6 mt-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
              <i className="ri-archive-2-line text-white text-xs"></i>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Vaultly</span>
          </div>
          <p className="text-zinc-400 text-xs">© 2026 Vaultly. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-zinc-400 text-xs">
            <Link to="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Privacidad</Link>
            <Link to="/terms" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Términos</Link>
            <Link to="/contact" className="text-rose-500 font-medium">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
