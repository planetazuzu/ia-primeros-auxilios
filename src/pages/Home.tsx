import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Upload, Library, Heart, Shield, Users, BookOpen } from 'lucide-react';
import heroImage from '@/assets/hero-first-aid.jpg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Patrón de fondo gráfico */}
      <div className="absolute inset-0 bg-pattern opacity-30"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Contribuye con Recursos Educativos de{' '}
              <span className="text-gradient animate-glow block sm:inline">
                Primeros Auxilios
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Comparte protocolos, guías, infografías y recursos que ayudarán a entrenar 
              una IA educativa de código abierto
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl max-w-3xl mx-auto hover-lift animate-float mx-4 sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Primeros Auxilios - Colaboración educativa" 
              className="w-full h-auto relative z-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 shadow-lg hover:shadow-glow hover-lift transition-all h-12 md:h-14"
              onClick={() => navigate('/upload')}
            >
              <Upload className="mr-2 h-5 w-5" />
              Subir recurso
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base md:text-lg px-8 glass-effect hover-lift hover:shadow-md transition-all h-12 md:h-14"
              onClick={() => navigate('/recursos')}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Ver recursos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base md:text-lg px-8 glass-effect hover-lift hover:shadow-md transition-all h-12 md:h-14"
              onClick={() => navigate('/repository')}
            >
              <Library className="mr-2 h-5 w-5" />
              Ver repositorio
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué participar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover-lift hover:shadow-lg glass-effect transition-all animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gradient-primary rounded-2xl shadow-md hover:shadow-glow transition-all animate-float">
                    <Heart className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-gradient">Impacto Social</h3>
                  <p className="text-muted-foreground">
                    Tu contribución ayudará a salvar vidas a través de una IA educativa 
                    accesible para todos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover-lift hover:shadow-lg glass-effect transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gradient-secondary rounded-2xl shadow-md hover:shadow-glow transition-all animate-float" style={{ animationDelay: '0.2s' }}>
                    <Shield className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-gradient">Licencia Abierta</h3>
                  <p className="text-muted-foreground">
                    Todo el contenido se publica bajo CC BY-SA 4.0, 
                    garantizando libre acceso y uso educativo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover-lift hover:shadow-lg glass-effect transition-all animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gradient-accent rounded-2xl shadow-md hover:shadow-glow transition-all animate-float" style={{ animationDelay: '0.4s' }}>
                    <Users className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-gradient">Colaboración</h3>
                  <p className="text-muted-foreground">
                    Forma parte de una comunidad global comprometida con 
                    la educación en salud
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <Card className="max-w-3xl mx-auto bg-gradient-primary text-primary-foreground border-0 shadow-xl hover:shadow-glow hover-lift transition-all">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold animate-glow">¿Listo para contribuir?</h2>
            <p className="text-lg opacity-90">
              Cada recurso que compartes nos acerca más a una educación en 
              primeros auxilios accesible para todos
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={() => navigate('/upload')}
            >
              Comenzar ahora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
