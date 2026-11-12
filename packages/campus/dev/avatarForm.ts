// Formulaire HTML de l'avatar, partagé par l'écran de création et la cabine d'essayage.
// Il joue le rôle de l'app : il se construit à partir du catalogue exporté par le module.
// Dans l'app Expo, ce seront des composants React Native, avec la même logique.
import {
  COLOR_OPTIONS,
  PART_OPTIONS,
  PRESETS,
  copyLook,
  sameLook,
  type AvatarLook,
  type LayerId,
} from '../src';

const SECTIONS: ReadonlyArray<readonly [LayerId, string]> = [
  ['hair', 'Cheveux'],
  ['outfit', 'Tenue'],
  ['body', 'Peau'],
];

const toCss = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;

export interface AvatarFormOptions {
  look: AvatarLook;
  /** Champ « Nom affiché » : à la création du compte, pas dans la cabine d'essayage. */
  withName: boolean;
  /** Chaque modification, pour mettre l'aperçu à jour en direct. */
  onChange(look: AvatarLook): void;
  onSubmit(look: AvatarLook, displayName: string | null): void;
  /** Si présent, un bouton « Annuler » est ajouté. */
  onCancel?: () => void;
}

export function createAvatarForm(options: AvatarFormOptions): HTMLFormElement {
  let look = copyLook(options.look);

  const form = document.createElement('form');
  form.className = 'creator__form';
  // Les libellés viennent de notre catalogue (pas de l'utilisateur) : on peut les injecter en HTML.
  // Les pastilles sont de vrais boutons radio : flèches pour changer, Tab pour passer au groupe suivant.
  form.innerHTML = `
    <fieldset>
      <legend>Modèles</legend>
      <div class="row">
        ${PRESETS.map((p) => `<button type="button" data-preset="${p.id}">${p.label}</button>`).join('')}
      </div>
    </fieldset>
    ${
      options.withName
        ? `<label class="field">
            Nom affiché
            <input name="displayName" required minlength="2" maxlength="30" autocomplete="nickname">
          </label>`
        : ''
    }
    ${SECTIONS.map(
      ([layer, title]) => `
      <fieldset>
        <legend>${title}</legend>
        ${
          PART_OPTIONS[layer].length > 1
            ? `<div class="row">${PART_OPTIONS[layer]
                .map((part) => `<label class="chip"><input type="radio" name="${layer}-part" value="${part.id}"><span>${part.label}</span></label>`)
                .join('')}</div>`
            : ''
        }
        <div class="row">${COLOR_OPTIONS[layer]
          .map((c) => `<label class="swatch" style="--color: ${toCss(c.hex)}"><input type="radio" name="${layer}-color" value="${c.hex}" aria-label="${c.label}"></label>`)
          .join('')}</div>
      </fieldset>`,
    ).join('')}
    <div class="actions">
      ${options.onCancel ? '<button type="button" data-cancel>Annuler</button>' : ''}
      <button type="submit" class="primary">Valider</button>
    </div>
  `;

  /** Recopie l'apparence dans le formulaire (cases cochées, modèle sélectionné). */
  const render = (): void => {
    for (const [layer] of SECTIONS) {
      form.querySelectorAll<HTMLInputElement>(`input[name="${layer}-part"]`).forEach((input) => {
        input.checked = input.value === look.parts[layer];
      });
      form.querySelectorAll<HTMLInputElement>(`input[name="${layer}-color"]`).forEach((input) => {
        input.checked = Number(input.value) === look.colors[layer];
      });
    }
    form.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
      const preset = PRESETS.find((p) => p.id === button.dataset.preset);
      button.setAttribute('aria-pressed', String(preset !== undefined && sameLook(preset.look, look)));
    });
  };

  const apply = (next: AvatarLook): void => {
    look = next;
    options.onChange(copyLook(look));
    render();
  };

  // Un seul écouteur pour tout le formulaire : l'événement « change » remonte depuis chaque case.
  form.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const [layer, kind] = input.name.split('-') as [LayerId, 'part' | 'color' | undefined];
    if (kind === 'part') apply({ ...look, parts: { ...look.parts, [layer]: input.value } });
    if (kind === 'color') apply({ ...look, colors: { ...look.colors, [layer]: Number(input.value) } });
  });

  form.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-cancel]')) {
      options.onCancel?.();
      return;
    }
    const id = target.closest<HTMLElement>('[data-preset]')?.dataset.preset;
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) apply(copyLook(preset.look));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Le navigateur vérifie le champ (requis, 2 à 30 caractères) et affiche lui-même le message
    if (!form.reportValidity()) return;
    const name = new FormData(form).get('displayName');
    options.onSubmit(copyLook(look), typeof name === 'string' ? name : null);
  });

  render();
  return form;
}
