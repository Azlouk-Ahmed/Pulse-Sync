import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";
import Lucide from "../../base-components/Lucide";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import { FormSwitch } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useRef } from "react";

function RendezVousNotification() {
  // Notification de rappel de rendez-vous
  const rendezVousNotification = useRef<NotificationElement>();
  const showRendezVousNotification = () => {
    rendezVousNotification.current?.showToast();
  };

  // Notification de confirmation de rendez-vous
  const confirmationNotification = useRef<NotificationElement>();
  const showConfirmationNotification = () => {
    confirmationNotification.current?.showToast();
  };

  // Notification d'annulation de rendez-vous
  const annulationNotification = useRef<NotificationElement>();
  const showAnnulationNotification = () => {
    annulationNotification.current?.showToast();
  };

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Notifications de Rendez-vous</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-6">
          {/* BEGIN: Rappel de Rendez-vous */}
          <PreviewComponent className="intro-y box">
            {({ toggle }) => (
              <>
                <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium">
                    Rappel de Rendez-vous
                  </h2>
                  <FormSwitch className="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
                    <FormSwitch.Label htmlFor="show-example-1">
                      Afficher le code
                    </FormSwitch.Label>
                    <FormSwitch.Input
                      id="show-example-1"
                      onClick={toggle}
                      className="ml-3 mr-0"
                      type="checkbox"
                    />
                  </FormSwitch>
                </div>
                <div className="p-5">
                  <Preview>
                    <div className="text-center">
                      {/* Contenu de la notification */}
                      <Notification
                        getRef={(el) => {
                          rendezVousNotification.current = el;
                        }}
                        options={{
                          duration: 5000,
                        }}
                        className="flex"
                      >
                        <Lucide icon="Clock" className="text-primary" />
                        <div className="ml-4 mr-4">
                          <div className="font-medium">Rappel de Rendez-vous</div>
                          <div className="mt-1 text-slate-500">
                            Vous avez un rendez-vous avec <strong>Dr. Smith</strong> demain à <strong>10:30</strong>.
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-slate-500">Spécialité: </span>
                            <span className="font-medium">Cardiologie</span>
                          </div>
                        </div>
                      </Notification>
                      {/* Bouton pour afficher la notification */}
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={showRendezVousNotification}
                      >
                        Afficher le Rappel
                      </Button>
                    </div>
                  </Preview>
                  <Source>
                    <Highlight>
                      {`
              <div className="text-center">
                <Notification
                  getRef={(el) => {
                    rendezVousNotification.current = el;
                  }}
                  options={{
                    duration: 5000,
                  }}
                  className="flex"
                >
                  <Lucide icon="Clock" className="text-primary" />
                  <div className="ml-4 mr-4">
                    <div className="font-medium">Rappel de Rendez-vous</div>
                    <div className="mt-1 text-slate-500">
                      Vous avez un rendez-vous avec <strong>Dr. Smith</strong> demain à <strong>10:30</strong>.
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-slate-500">Spécialité: </span>
                      <span className="font-medium">Cardiologie</span>
                    </div>
                  </div>
                </Notification>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={showRendezVousNotification}
                >
                  Afficher le Rappel
                </Button>
              </div>
              `}
                    </Highlight>
                    <Highlight type="javascript" className="mt-5">
                      {`
                // Notification de rappel de rendez-vous
                const rendezVousNotification = useRef<NotificationElement>();
                const showRendezVousNotification = () => {
                  rendezVousNotification.current?.showToast();
                };
                `}
                    </Highlight>
                  </Source>
                </div>
              </>
            )}
          </PreviewComponent>
          {/* END: Rappel de Rendez-vous */}

          {/* BEGIN: Confirmation de Rendez-vous */}
          <PreviewComponent className="mt-5 intro-y box">
            {({ toggle }) => (
              <>
                <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium">
                    Confirmation de Rendez-vous
                  </h2>
                  <FormSwitch className="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
                    <FormSwitch.Label htmlFor="show-example-2">
                      Afficher le code
                    </FormSwitch.Label>
                    <FormSwitch.Input
                      id="show-example-2"
                      onClick={toggle}
                      className="ml-3 mr-0"
                      type="checkbox"
                    />
                  </FormSwitch>
                </div>
                <div className="p-5">
                  <Preview>
                    <div className="text-center">
                      <Notification
                        getRef={(el) => {
                          confirmationNotification.current = el;
                        }}
                        className="flex"
                      >
                        <Lucide icon="CheckCircle" className="text-success" />
                        <div className="ml-4 mr-4">
                          <div className="font-medium">Rendez-vous Confirmé!</div>
                          <div className="mt-1 text-slate-500">
                            Votre rendez-vous avec <strong>Dr. Johnson</strong> a été confirmé pour le <strong>22/04/2023 à 14:00</strong>.
                          </div>
                          <div className="mt-2 font-medium flex">
                            <a
                              className="text-primary dark:text-slate-400"
                              href="#"
                            >
                              Voir les détails
                            </a>
                            <a className="ml-4 text-slate-500" href="#">
                              Annuler
                            </a>
                          </div>
                        </div>
                      </Notification>
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={showConfirmationNotification}
                      >
                        Afficher la Confirmation
                      </Button>
                    </div>
                  </Preview>
                  <Source>
                    <Highlight>
                      {`
              <div className="text-center">
                <Notification
                  getRef={(el) => {
                    confirmationNotification.current = el;
                  }}
                  className="flex"
                >
                  <Lucide icon="CheckCircle" className="text-success" />
                  <div className="ml-4 mr-4">
                    <div className="font-medium">Rendez-vous Confirmé!</div>
                    <div className="mt-1 text-slate-500">
                      Votre rendez-vous avec <strong>Dr. Johnson</strong> a été confirmé pour le <strong>22/04/2023 à 14:00</strong>.
                    </div>
                    <div className="mt-2 font-medium flex">
                      <a
                        className="text-primary dark:text-slate-400"
                        href="#"
                      >
                        Voir les détails
                      </a>
                      <a className="ml-4 text-slate-500" href="#">
                        Annuler
                      </a>
                    </div>
                  </div>
                </Notification>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={showConfirmationNotification}
                >
                  Afficher la Confirmation
                </Button>
              </div>
              `}
                    </Highlight>
                    <Highlight type="javascript" className="mt-5">
                      {`
                // Notification de confirmation de rendez-vous
                const confirmationNotification = useRef<NotificationElement>();
                const showConfirmationNotification = () => {
                  confirmationNotification.current?.showToast();
                };
                `}
                    </Highlight>
                  </Source>
                </div>
              </>
            )}
          </PreviewComponent>
          {/* END: Confirmation de Rendez-vous */}
        </div>
        <div className="col-span-12 intro-y lg:col-span-6">
          {/* BEGIN: Annulation de Rendez-vous */}
          <PreviewComponent className="intro-y box">
            {({ toggle }) => (
              <>
                <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium">
                    Annulation de Rendez-vous
                  </h2>
                  <FormSwitch className="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
                    <FormSwitch.Label htmlFor="show-example-3">
                      Afficher le code
                    </FormSwitch.Label>
                    <FormSwitch.Input
                      id="show-example-3"
                      onClick={toggle}
                      className="ml-3 mr-0"
                      type="checkbox"
                    />
                  </FormSwitch>
                </div>
                <div className="p-5">
                  <Preview>
                    <div className="text-center">
                      <Notification
                        getRef={(el) => {
                          annulationNotification.current = el;
                        }}
                        className="flex"
                      >
                        <Lucide icon="XCircle" className="text-danger" />
                        <div className="ml-4 mr-4">
                          <div className="font-medium">Rendez-vous Annulé</div>
                          <div className="mt-1 text-slate-500">
                            Votre rendez-vous avec <strong>Dr. Wilson</strong> prévu pour le <strong>25/04/2023</strong> a été annulé.
                          </div>
                          <div className="mt-3">
                            <Button
                              variant="primary"
                              as="a"
                              className="px-2 py-1 mr-2"
                              href="#"
                            >
                              Prendre un nouveau RDV
                            </Button>
                            <Button
                              variant="outline-secondary"
                              as="a"
                              className="px-2 py-1"
                              href="#"
                            >
                              Contacter le secrétariat
                            </Button>
                          </div>
                        </div>
                      </Notification>
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={showAnnulationNotification}
                      >
                        Afficher l'Annulation
                      </Button>
                    </div>
                  </Preview>
                  <Source>
                    <Highlight>
                      {`
              <div className="text-center">
                <Notification
                  getRef={(el) => {
                    annulationNotification.current = el;
                  }}
                  className="flex"
                >
                  <Lucide icon="XCircle" className="text-danger" />
                  <div className="ml-4 mr-4">
                    <div className="font-medium">Rendez-vous Annulé</div>
                    <div className="mt-1 text-slate-500">
                      Votre rendez-vous avec <strong>Dr. Wilson</strong> prévu pour le <strong>25/04/2023</strong> a été annulé.
                    </div>
                    <div className="mt-3">
                      <Button
                        variant="primary"
                        as="a"
                        className="px-2 py-1 mr-2"
                        href="#"
                      >
                        Prendre un nouveau RDV
                      </Button>
                      <Button
                        variant="outline-secondary"
                        as="a"
                        className="px-2 py-1"
                        href="#"
                      >
                        Contacter le secrétariat
                      </Button>
                    </div>
                  </div>
                </Notification>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={showAnnulationNotification}
                >
                  Afficher l'Annulation
                </Button>
              </div>
              `}
                    </Highlight>
                    <Highlight type="javascript" className="mt-5">
                      {`
                // Notification d'annulation de rendez-vous
                const annulationNotification = useRef<NotificationElement>();
                const showAnnulationNotification = () => {
                  annulationNotification.current?.showToast();
                };
                `}
                    </Highlight>
                  </Source>
                </div>
              </>
            )}
          </PreviewComponent>
          {/* END: Annulation de Rendez-vous */}
        </div>
      </div>
    </>
  );
}

export default RendezVousNotification;