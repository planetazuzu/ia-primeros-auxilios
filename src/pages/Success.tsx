import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Home, ExternalLink } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const prUrl = location.state?.prUrl as string | undefined;

  useEffect(() => {
    if (!prUrl) {
      navigate('/');
    }
  }, [prUrl, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-secondary/10 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-secondary" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              ¡Recurso enviado exitosamente!
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Tu contribución ha sido enviada al repositorio y está lista para revisión
            </p>
          </div>

          <Card className="bg-muted/50 border-2">
            <CardContent className="pt-6 space-y-3">
              <p className="font-medium text-foreground">
                Pull Request creado
              </p>
              <p className="text-sm text-muted-foreground">
                El equipo de mantenedores revisará tu aportación pronto
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/')}
              variant="outline"
            >
              <Home className="mr-2 h-5 w-5" />
              Volver al inicio
            </Button>
            {prUrl && (
              <Button
                size="lg"
                asChild
              >
                <a href={prUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Ver Pull Request
                </a>
              </Button>
            )}
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              ¿Tienes más recursos para compartir?
            </p>
            <Button
              variant="link"
              onClick={() => navigate('/upload')}
              className="mt-2"
            >
              Subir otro recurso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
