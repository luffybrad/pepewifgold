  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/stores/user'
  import logo from '@/assets/images/pepewifgold.jpg'

  const userStore = useUserStore()
  const snackbar = ref(false)
  const snackbarMessage = ref('Link copied!')
  const referralLink = ref('')

  const steps = ref(
    [
      {id: 1, detail: "Click the link to get started."},
      {id: 2, detail: "Sign up and start exploring."},
      {id: 3, detail: "Invite your friends using your own referral link."},
      {id: 4, detail: "Earn PepeWifGold Coins with every new sign-up and invite!"}
    ]
  )

  // Fetch user's unique referral link
  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:5000/referral-link', {
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        }
      })
      const data = await response.json()
      referralLink.value = data.referralLink
    } catch (err) {
      console.error('Failed to fetch referral link:', err)
    }
  })

  // Copy link function
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink.value)
      snackbarMessage.value = 'Link copied!'
      snackbar.value = true
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Share function
  async function shareLink() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join me on PepeWifGold!',
          text: 'Use my referral link to sign up and earn coins!',
          url: referralLink.value
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await copyLink();
        snackbarMessage.value = 'Link copied! You can now paste it anywhere to share.';
        snackbar.value = true;
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  }
  </script>

  <template>

    <v-container
    >
      <span
      class="d-flex justify-center text-green text-h4"

      >
      Invite Friends
    </span>
    <v-divider
    class="my-5"
    thickness="1"
    color="success"
    opacity="10"
    >

    </v-divider>
    <v-card
      variant="tonal"
      class="mx-auto my-5 bg-green"
      :prepend-avatar="logo"
    >
      <template v-slot:title>
        <span class="font-weight-black">Invite Friends and Earn</span>
      </template>

      <template v-slot:subtitle>
        <span
        class="text-subtitle-1">
          <v-avatar
          density="compact"
          size="x-small"
          >
          <v-img
          :src="logo"
          ></v-img>
        </v-avatar>

          500</span>
      </template>

      <v-card-text class="pt-4">
        <p
        class="text-h6"
        >
          Here’s how it works:
        </p>
        <v-list
        class="bg-green text-body-1"
        variant="tonal"
        >
      <v-list-item
        v-for="step in steps"
        :key="step.id"
        rounded
      >
        <template v-slot:prepend>
          <v-icon>mdi-star</v-icon>
        </template>

       {{ step.detail }}
       </v-list-item>
    </v-list>
      </v-card-text>
    </v-card>

    <v-row

    class="d-flex text-center justify-space-evenly align-center my-5">

    <v-col
    cols="12"
    >
    <span
    class="text-body-2 text-green"
    >
      Referral link
    </span>

    <v-text-field
        density="compact"
        variant="outlined"
        readonly
        class="text-green"
      >
    {{ referralLink }}
    </v-text-field>
    </v-col>
    <v-col>


          <v-btn
      append-icon="mdi-content-copy"
      rounded="xl"
      color="green"
      variant="outlined"
      elevation="5"
      @click="copyLink"
      >
        Copy Link
      </v-btn>
      <v-snackbar
      v-model="snackbar"
      timeout="2000"
    >
      {{ snackbarMessage }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
          icon="mdi-close"
          size="small"
        >
        </v-btn>
      </template>
    </v-snackbar>
    </v-col>

    <v-col>
      <v-btn
      append-icon="mdi-share-variant"
      rounded="xl"
      color="green"
      variant="outlined"
      elevation="5"
      @click="shareLink"
      >
        Share
      </v-btn>
    </v-col>
    </v-row>


    </v-container>
  </template>
  <style scoped>
  </style>

