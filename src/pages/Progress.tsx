import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProgressModal, ProgressStep, StepStatus } from '@/components/ProgressModal';
import { ResourcePreview, ResourceFormData } from '@/types/resource';
import { useGithubUpload } from '@/hooks/useGithubUpload';

export default function Progress() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, upload } = useGithubUpload();
  const [steps, setSteps] = useState<ProgressStep[]>([
    { id: 'branch', label: 'Creando rama en el repositorio', status: 'pending' },
    { id: 'file', label: 'Subiendo archivo', status: 'pending' },
    { id: 'metadata', label: 'Subiendo metadata', status: 'pending' },
    { id: 'pr', label: 'Creando Pull Request', status: 'pending' },
  ]);

  useEffect(() => {
    const preview = location.state?.preview as ResourcePreview;
    const formData = location.state?.formData as ResourceFormData;
    
    if (!preview) {
      navigate('/upload');
      return;
    }

    // Ejecutar flujo de subida
    upload(preview, formData || {} as ResourceFormData);
  }, [location, navigate, upload]);

  // Sincronizar estados del hook con los steps del modal
  useEffect(() => {
    const updateStepsFromState = () => {
      setSteps(prev => {
        const newSteps = [...prev];
        
        switch (state.step) {
          case 'idle':
            // Todos en pending
            break;
          case 'branch':
            newSteps[0] = { ...newSteps[0], status: state.error ? 'error' : 'loading', error: state.error };
            break;
          case 'file':
            newSteps[0] = { ...newSteps[0], status: 'success' };
            newSteps[1] = { ...newSteps[1], status: state.error ? 'error' : 'loading', error: state.error };
            break;
          case 'metadata':
            newSteps[0] = { ...newSteps[0], status: 'success' };
            newSteps[1] = { ...newSteps[1], status: 'success' };
            newSteps[2] = { ...newSteps[2], status: state.error ? 'error' : 'loading', error: state.error };
            break;
          case 'pr':
            newSteps[0] = { ...newSteps[0], status: 'success' };
            newSteps[1] = { ...newSteps[1], status: 'success' };
            newSteps[2] = { ...newSteps[2], status: 'success' };
            newSteps[3] = { ...newSteps[3], status: state.error ? 'error' : 'loading', error: state.error };
            break;
          case 'success':
            newSteps.forEach(step => {
              if (step.status !== 'error') {
                step.status = 'success';
              }
            });
            // Navegar a la página de éxito después de un breve delay
            setTimeout(() => {
              navigate('/success', { 
                state: { 
                  prUrl: state.prUrl, 
                  prNumber: state.prNumber,
                  preview: location.state?.preview 
                } 
              });
            }, 1500);
            break;
          case 'error':
            // Marcar el step actual como error
            const currentStepIndex = newSteps.findIndex(s => s.status === 'loading');
            if (currentStepIndex >= 0) {
              newSteps[currentStepIndex] = { 
                ...newSteps[currentStepIndex], 
                status: 'error', 
                error: state.error 
              };
            }
            break;
        }
        
        return newSteps;
      });
    };

    updateStepsFromState();
  }, [state, navigate, location]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ProgressModal
        open={true}
        title="Enviando al repositorio"
        description="Por favor, espera mientras procesamos tu recurso"
        steps={steps}
      />
    </div>
  );
}
