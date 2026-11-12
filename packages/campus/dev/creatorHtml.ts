// VERSION DE COMPARAISON : l'écran de création en HTML. Il joue le rôle de l'app : il construit
// son interface à partir du catalogue exporté par le module, et pilote l'aperçu avec setLook().
// Dans l'app Expo, ce seront des composants React Native, avec la même logique.
import './creator.css';
import {
  COLOR_OPTIONS,
  DEFAULT_LOOK,
  PART_OPTIONS,
  PRESETS,
  copyLook,
  createCampusGame,
  sameLook,
  type AvatarLook,
  type LayerId,
} from '../src';
import { showToast } from './toast';

const SECTIONS: ReadonlyArray<readonly [LayerId, string]> = [
  ['hair', 'Cheveux'],
  ['outfit', 'Tenue'],
  ['body', 'Peau'],
];

const toCss = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;

/** Monte l'écran dans parent et renvoie une fonction qui le démonte. */
export function mountHtmlCreator(parent: HTMLElement): () => void {
  let look = copyLook(DEFAULT_LOOK);

  const screen = document.createElement('div');
  screen.className = 'creator';
  const preview = document.createElement('div');
  preview.className = 'creator__preview';
  const form = document.createElement('form');
  form.className = 'creator__form';
  form.setAttribute('aria-label', 'Créer mon avatar');
  screen.append(preview, form);
  parent.append(screen);

  // Le jeu n'occupe que la boîte d'aperçu : c'est la mise en page CSS qui décide de sa taille.
  const game = createCampusGame(preview, { screen: 'creator', look });

  // Les libellés viennent de notre catalogue (pas de l'utilisateur) : on peut les injecter en HTML.
  // Les vraies pastilles sont des boutons radio : flèches pour changer, Tab pour passer au groupe suivant.
  form.innerHTML = `
    <fieldset>
      <legend>Modèles</legend>
      <div class="row">
        ${PRESETS.map((p) => `<button type="button" data-preset="${p.id}">${p.label}</button>`).join('')}
      </div>
    </fieldset>
    <label class="field">
      Nom affiché
      <input name="displayName" required minlength="2" maxlength="30" autocomplete="nickname">
    </label>
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
    <button type="submit" class="primary">Valider</button>
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
    game.setLook(copyLook(look));
    render();
  };

  // Un seul écouteur pour tout le formulaire : l'événement « change » remonte depuis chaque case.
  form.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const [layer, kind] = input.name.split('-') as [LayerId, 'part' | 'color'];
    if (kind === 'part') apply({ ...look, parts: { ...look.parts, [layer]: input.value } });
    if (kind === 'color') apply({ ...look, colors: { ...look.colors, [layer]: Number(input.value) } });
  });

  form.addEventListener('click', (event) => {
    const id = (event.target as HTMLElement).closest<HTMLElement>('[data-preset]')?.dataset.preset;
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) apply(copyLook(preset.look));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Le navigateur vérifie le champ (requis, 2 à 30 caractères) et affiche lui-même le message
    if (!form.reportValidity()) return;
    const name = new FormData(form).get('displayName');
    console.info('Avatar validé', { displayName: name, look });
    showToast(`Avatar de ${String(name)} validé`);
  });

  render();
  return () => {
    game.destroy();
    screen.remove();
  };
}
