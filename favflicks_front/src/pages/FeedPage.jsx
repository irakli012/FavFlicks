import React, { useState, useEffect } from 'react';
import FeedPost from '../components/feed/FeedPost';

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, using mock data
    const mockPosts = [
      {
        id: 1,
        user: {
          name: 'Ava Harper',
          username: 'Ava Harper',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiKOxIIpGFFcRioDviSL0VeJA-9T5LLhwsPBImrKngp66LetMDmNaEgAY06dm_QSyJPIjg7rOoO0E7K7SW36kx-b_S6K8rO3iG56XaaAbVgtjbblKiebdOxFkZV13c_u39i0OsvciJ5Rf6y_b6iAKLZTu_1WVgm_dBeqZVBpoxaQDuPEJzoakSlLs1fMpT90LZ2igUf_E7Kutdu-16CV3F-OsEPWHB4JQlxhj4L0xWncjvytdHIkYmL6I3C1kT1EYdhGlFcpisbDQI',
        },
        movie: {
          id: 1,
          title: 'The Enigma Code',
          genres: 'Action, Thriller',
          description: 'A gripping thriller with unexpected twists.',
          imagePath: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuX5meHzFuJpvyjS0dKLr27Iv3enuumILGeHknu0pHAyA4Ud6xA39dW1CNcKlFNBOT3JVPfg6NFwcfvpyaK2Wd3Euc-Yk4RSHhLq0zx0akSKKAEDAYIks5lV-YFLnzEjuvbaYAcISvnaJHM4elcIJs1AYNd2AH0l9VYXk5thEJHHGUFWCqMWxoRWVH6Kpp2_Zj-QEG5L3oWXXdXTduw7A1CA-9eD9b1OaKgazM7y2j9ackPxQLL6jQAcXy48boIEhsKWpFFB2ZN6Rq',
        },
        likes: 123,
        comments: 45,
        shares: 67,
        timestamp: '2d',
        commentsList: [
          {
            id: 1,
            user: {
              name: 'Liam Carter',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAnSgHLZOJ9CaiyhX8Kykm7b7GlmMw10J41xg2QJqerSRYKZztv-zzrAh9mY6Y-mTnFpC9hFdeezUeKiGkwRHr1GG-kTjkJkkRDlNyM33yzguEQkDIIKpsseDQhiHkhntFhSeNlc_hXCtrMTtrec2LW3lgdL7CmYBs3O_ID0A9yLWyRvZTE5PPwqvmEDDHsWtWyOJnxXj3ooJmduXiV9mK-aUfEy_SbRiNCTLjqS6NVs8KQp_dvS2zIK33vmYtzBHmdorikhc-dQb5',
            },
            content: 'This movie was amazing! The plot twists kept me on the edge of my seat.',
            timestamp: '1d',
          },
          {
            id: 2,
            user: {
              name: 'Chloe Bennett',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnUeLcyVvSdRE_6sYe9yWIlyhGbAsXQLIyMV76YM7Gh3N9X-kr7ETKWwRH8nAtnmEFeSE-iBUriJiBDT7y9M82vg60VdAfdXZLJS8qnevxNeGMMHIWwppWjtRwb0D31p_9TerGU0_ZWZnSrBo4U0BVJSEdjJfok_x2pa-jwW77I3rbbVh0c5qdrqTHI5-XhV8fRmszTRbIwOXO4ttTBEzYIcZSsiQc0vpNO5QzPWIlRvoGX7LWZsNg2qqHjdJ5E0-7qvo324Y9TAeh',
            },
            content: 'I agree, the acting was superb and the story was so well-crafted.',
            timestamp: '2d',
          },
        ],
      },
      {
        id: 2,
        user: {
          name: 'Noah Thompson',
          username: 'Noah Thompson',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvQpcTBFJibtwZe_nqHPpGUXrlWZGbZ-i2g_-S5X_SoUq-1IY_ezK64-RI13Rt1BPSoVRyVqM4WknBVHHcU1CBXmU1kS1L0jofZ-vYsEkLpFbNP41-3OfSUjcQzSwVV_aDzhQ0tmizlewgqLi_QlpbObI_ZXwuDLvZSuG4dEwC3T9Y7U3IIYdZcxE6fH-8QtqhexAGIfErACT7CGbm2paPIjeQZOTW7gD_soNWfpEJ8C1DGjKQYOqbDbmbkR3PLCbKjQBj1OuEMO1G',
        },
        movie: {
          id: 2,
          title: 'The Lost Horizon',
          genres: 'Adventure, Drama',
          description: 'A heartwarming story about friendship and adventure.',
          imagePath: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyuNjOlVAXGskgx18hZ6l869oAz4YWeFV74mDzj3c_4V-18pWg68FnHp2V3VLeBgjz600FwDKijbC_VDKQ_g_QEKvnaiT_bhFOdU37GPcqWXXAZ9HRiUKu81HFpF6lF7TiRGw4srESCE-w6kTVC0u-GPIpAzvXRRrcjgiAtPtTH9F19ps7izLjfUz41gHfBUboNi6aIyOb6jng_T9tronPM-0bQTx3DZnjL6r2s-ph5Z8hCcyEEFsYi163guDfS8wLnN8JPdMVYHfH',
        },
        likes: 89,
        comments: 32,
        shares: 54,
        timestamp: '3d',
        commentsList: [
          {
            id: 3,
            user: {
              name: 'Isabella Hayes',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUWjXZqNhYQNvQ_k_zcN7vqjU_gItv5Fv7WKjr1XhuoG8DT7OtDWyEPwXfPLz1AOr7j9dx6t6v51oLTDkJlgCXYwYRrsdz6YUh6BHbLy8xGRz8I3o_jGXG9UxssysSYazOIubFKQK2PEW_h-iqQXec-HYYN1EMYo1jNYAAUj38R_30-IMdEVSer0KmuPDPEqwlvclJpRWsPcrwdx-p3k4UfVOqgqMIfiLuAOWg_gwJ4qSfBrsdP-Ic1rBUrstR7qOZgZzQbfSFf6_E',
            },
            content: 'Such a beautiful film! The scenery was breathtaking.',
            timestamp: '2d',
          },
          {
            id: 4,
            user: {
              name: 'Owen Parker',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdzr0MMlVz8NzT7bHGJHcWeDtT-8cC4ULMAybZuTbHDPTcqosk6_vFr-oRzJVD15jiYq9jpHpa-a64bCHaba28k6syuF3pz4kxATyPK1u2gxge4e8sUEb8Uv5wZMnQzYcXfx0V389obM-uaHiGVKqmVrJNTbUKKpRJ--9VMeYhlYjJd6ZUU7eiPNqbPRMQe0ZXs0O9q-7NoT-EFq0V5M8UMTMsVpkBO0FyNJQfwTgYPNEWxau-mz6ZYNb8ej_kmxITl2t8l4VbOPom',
            },
            content: 'I loved the message of the movie. It really resonated with me.',
            timestamp: '3d',
          },
        ],
      },
      {
        id: 3,
        user: {
          name: 'Emma Foster',
          username: 'Emma Foster',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqlc4pDRCg37wRvmU41XLfzeADJ_a3I9razvoK2ZGCqvz-Av_IZphOqFaDNtS-B8kKgNzfUpxMNNzgchh2BX0TJg1dkhSQJvsOSiB2PHX_G1_h3vaulRyWFuqmEojMzdmMZyWgwrg6L1I6NQCEWInNRsx4l13G0SuVD-TZ6NsLFFrfW7Yr9YPjjdHI_AhG6EQ6-CInBUl8JtlU0JIOdKKjYBVZ-4FAQEDeUxZdjcrFxgw_Q5FvV6ZZWwlwmhimuiPMrD-j4jv15UWe',
        },
        movie: {
          id: 3,
          title: 'Cosmic Odyssey',
          genres: 'Sci-Fi, Adventure',
          description: 'A visually stunning sci-fi epic.',
          imagePath: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD1vkJJ8DiOI6oGIc00fKbA87B8I4RQcmW-x0ZiT5j-QqPrOuGwtvElJ0M4p85WHu4n0QRlXH966AHqsGXe7O5a33YMYxipFVYrEsjNi5dNcJ4IShguAcD6FSU4GOfA1hSCGGPrjJDa7seh1WkKccSAKYM-5iN6wPgv3BKsvAKC2uCEK9qCSB239vl_p6BR1_PgESE5DGSq3eTIULUc9rHSjvv_gcyNpV3Y0eoByrPOF1XkkFaLxk5Sj54L4WisiIPblkAohLk-tXU',
        },
        likes: 156,
        comments: 78,
        shares: 90,
        timestamp: '4d',
        commentsList: [
          {
            id: 5,
            user: {
              name: 'Lucas Reed',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqazPyFQRHh5FLYiav_nUY9npa3YWNZl_XxG-zZTY4N37Oud4vqRAx_9H39RDBk_greyKAokys1YYkSxQ_yREvmnM5_qcR_5NwmDAcLS0ryjlVAxDXLKBrTEUhu2JJnQOQM-_rQoaPa6I1D2nnBc6jDWKm1slHqljADim3OQZVZcXe1mBIMeQgwveexXbgBByb0GIbJIazURohZSHSOng6qzxIcRy9PuEhCeSZ7SXzLHBD08elSKEMRi9B8XkGVTw9gQcGlza5hxsI',
            },
            content: 'The special effects were out of this world! A must-see for sci-fi fans.',
            timestamp: '3d',
          },
          {
            id: 6,
            user: {
              name: 'Sophia Bennett',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5JyQDkgI2gUQ5Id3FYNofN_NO1FJ-7wvFx_oQWTwxF0d7TG9Ti-ZPE05rCOjraYcS1uRu_nAzWziP1Ve-ws9zCWpjeDMwSKP2t91Ej_tbVORUKghWUJ-YrhOw_BhZZAu6UHk5_H1E1JgUKCU-IVDuuAkcuKSZtZesQx60I1KIC8NyZ2wOQ7J6E5jNMLDVnpRIHfaSYCA7OZeORTNVpPt_-OFvhwavVws2vh0sWparhFK8b3oEhneI-mnOGkOqK6Bn7NrtTr7kpiA0',
            },
            content: 'I was captivated from start to finish. The visuals were stunning and the story was engaging.',
            timestamp: '4d',
          },
        ],
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#181111] text-white">
        <div className="text-xl">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#181111] min-h-screen">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
          Community Feed
        </h2>
        
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <div className="text-center text-[#b99d9e] py-12">
              <p className="text-lg">No posts yet. Be the first to share a movie!</p>
            </div>
          ) : (
            posts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
